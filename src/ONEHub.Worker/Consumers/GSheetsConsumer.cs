using EasyNetQ;
using EasyNetQ.Consumer;
using EasyNetQ.Topology;
using ONEbook.UM.Services;
using ONEHub.Application.Services;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Params;

namespace ONEHub.Worker.Consumers;

public sealed class GSheetsConsumer(
    IMaintenanceService maintenanceService,
    IBus bus,
    IGSheetsDataService gSheetsDataService,
    ILogProvider logger) : BackgroundService
{
    private const string MAINTENANCE_MESSAGE = "Maintenance mode active – message retained in queue.";

    private IDisposable? _rpcConsumerHandle;
    private IDisposable? _queueConsumerHandle;
    private readonly SemaphoreSlim _rateLimiter = new(1, 1);
    private const int RATE_LIMIT_DELAY_MILLISECONDS = 1000;
    private const int MAX_RETRY_COUNT = 5;
    private const int TIME_TO_RE_QUEUE = 30000;
    private const int INITIAL_DELAY_MILLISECONDS = 10;

    private bool _isUnderMaintenance;
    private readonly object _maintenanceLock = new();

    private Exchange _retryExchange;
    private Exchange _errorExchange;
    private Queue _mainQueue;

    private void EnableMaintenanceMode()
    {
        lock (_maintenanceLock)
        {
            if (_isUnderMaintenance)
            {
                return;
            }

            _isUnderMaintenance = true;
            _rpcConsumerHandle?.Dispose();
            _queueConsumerHandle?.Dispose();

            _rpcConsumerHandle = null;
            _queueConsumerHandle = null;
            logger.LogFileMessage("Maintenance mode enabled – message processing paused.");
        }
    }

    private void DisableMaintenanceMode()
    {
        lock (_maintenanceLock)
        {
            if (!_isUnderMaintenance)
            {
                return;
            }

            _isUnderMaintenance = false;
            _ = StartRpcConsumerAsync();
            StartQueueConsumer();
            logger.LogFileMessage("Maintenance mode disabled – message processing resumed.");
        }
    }

    private void CheckMaintenanceMode()
    {
        if (IsCurrentlyUnderMaintenance())
        {
            EnableMaintenanceMode();
        }
        else
        {
            DisableMaintenanceMode();
        }
    }

    private bool IsCurrentlyUnderMaintenance()
    {
        var maintenanceTime = maintenanceService.GetUnderMaintenanceTime();
        return maintenanceTime.IsUnderMaintenanceTime;
    }

    private async Task StartRpcConsumerAsync()
    {
        _rpcConsumerHandle = await bus.Rpc.RespondAsync<GSheetsQueueParam, GSheetsQueueResponse>(async request =>
        {
            if (IsCurrentlyUnderMaintenance())
            {
                logger.LogFileMessage(MAINTENANCE_MESSAGE);
                await Task.FromResult(AckStrategies.NackWithRequeue);
                return new GSheetsQueueResponse
                {
                    IsSuccess = false,
                    ErrorCode = 999,
                    ErrorMessage = MAINTENANCE_MESSAGE,
                    Data = null
                };
            }

            await _rateLimiter.WaitAsync();
            try
            {
                logger.LogFileMessage($"[RPC] Processing request: {request.RequestId}");

                var result = await gSheetsDataService.ProcessDataAsync(request);

                if (result.IsFailure)
                {
                    await logger.SentryErrorAsync($"[RPC] Processing failed for {request.RequestId}: {result.ErrorMessage}");

                    return new GSheetsQueueResponse
                    {
                        IsSuccess = false,
                        ErrorCode = result.ErrorCode,
                        ErrorMessage = result.ErrorMessage,
                        Data = null
                    };
                }

                logger.LogFileMessage($"[RPC] Successfully processed: {request.RequestId}");

                return new GSheetsQueueResponse
                {
                    IsSuccess = true,
                    ErrorCode = 0,
                    ErrorMessage = string.Empty,
                    Data = "Processed successfully"
                };
            }
            catch (Exception ex)
            {
                await logger.SentryErrorAsync($"[RPC] Exception processing: {request?.RequestId}", ex);

                return new GSheetsQueueResponse
                {
                    IsSuccess = false,
                    ErrorCode = 500,
                    ErrorMessage = ex.Message,
                    Data = null
                };
            }
            finally
            {
                await Task.Delay(RATE_LIMIT_DELAY_MILLISECONDS);
                _rateLimiter.Release();
            }
        });
    }

    private void StartQueueConsumer()
    {
        _queueConsumerHandle = bus.Advanced.Consume(_mainQueue, async (body, properties, _) =>
        {
            if (IsCurrentlyUnderMaintenance())
            {
                logger.LogFileMessage(MAINTENANCE_MESSAGE);
                return await Task.FromResult(AckStrategies.NackWithRequeue);
            }

            await _rateLimiter.WaitAsync();
            try
            {
                var message = System.Text.Json.JsonSerializer.Deserialize<GSheetsQueueParam>(body.Span);
                if (message == null)
                {
                    logger.LogFileMessage("[Queue] Failed to deserialize message");
                    return AckStrategies.Ack;
                }

                logger.LogFileMessage($"[Queue] Processing message: {message.RequestId}");

                var result = await gSheetsDataService.ProcessDataAsync(message);

                if (result.IsFailure)
                {
                    var errMessage = await ProcessMessageWhenError(body, properties);
                    await logger.SentryErrorAsync($"[Queue] {errMessage} - {result.ErrorMessage}");
                }
                else
                {
                    logger.LogFileMessage($"[Queue] Successfully processed: {message.RequestId}");
                }

                await Task.Delay(RATE_LIMIT_DELAY_MILLISECONDS);
                return AckStrategies.Ack;
            }
            catch (Exception ex)
            {
                var errMessage = await ProcessMessageWhenError(body, properties);
                await logger.SentryErrorAsync($"[Queue] {errMessage}", ex);
                await Task.Delay(RATE_LIMIT_DELAY_MILLISECONDS);
                return AckStrategies.Ack;
            }
            finally
            {
                _rateLimiter.Release();
            }
        });
    }

    private async Task<string> ProcessMessageWhenError(ReadOnlyMemory<byte> body, MessageProperties properties)
    {
        string errorMessage;
        var headers = properties.Headers;
        var retry = headers.TryGetValue("x-retry", out var retryObj) && retryObj is not null
            ? Convert.ToInt32(retryObj, System.Globalization.CultureInfo.InvariantCulture)
            : 0;

        retry++;

        var newProperties = new MessageProperties();
        foreach (var header in headers)
        {
            newProperties.Headers[header.Key] = header.Value;
        }
        newProperties.Headers["x-retry"] = retry;

        if (retry > MAX_RETRY_COUNT)
        {
            errorMessage = $"Moving message to dead-letter queue after {retry} retries.";
            await bus.Advanced.PublishAsync(_errorExchange, GSheetsQueueKeys.RoutingKey, false, newProperties, body);
        }
        else
        {
            errorMessage = $"Retrying message. Attempt {retry}.";
            await bus.Advanced.PublishAsync(_retryExchange, GSheetsQueueKeys.RoutingKey, false, newProperties, body);
        }

        return errorMessage;
    }


    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        await Task.Delay(INITIAL_DELAY_MILLISECONDS, stoppingToken).ConfigureAwait(false);

        var mainExchange = await bus.Advanced.ExchangeDeclareAsync(GSheetsQueueKeys.MainExchangeName, ExchangeType.Direct, cancellationToken: stoppingToken);
        _retryExchange = await bus.Advanced.ExchangeDeclareAsync(GSheetsQueueKeys.RetryQueueName, ExchangeType.Direct, cancellationToken: stoppingToken);
        _errorExchange = await bus.Advanced.ExchangeDeclareAsync(GSheetsQueueKeys.ErrorQueueName, ExchangeType.Direct, cancellationToken: stoppingToken);

        _mainQueue = await bus.Advanced.QueueDeclareAsync(GSheetsQueueKeys.MainQueueName, c => c
            .AsDurable(true)
            .AsExclusive(false)
            .AsAutoDelete(false)
            .WithArgument("x-queue-type", "quorum"), stoppingToken);

        var retryQueue = await bus.Advanced.QueueDeclareAsync(GSheetsQueueKeys.RetryQueueName, c => c
            .AsDurable(true)
            .AsExclusive(false)
            .AsAutoDelete(false)
            .WithArgument("x-queue-type", "quorum")
            .WithArgument("x-dead-letter-exchange", GSheetsQueueKeys.MainExchangeName)
            .WithArgument("x-message-ttl", TIME_TO_RE_QUEUE), stoppingToken);

        var errorQueue = await bus.Advanced.QueueDeclareAsync(GSheetsQueueKeys.ErrorQueueName, c => c
            .AsDurable(true)
            .AsExclusive(false)
            .AsAutoDelete(false)
            .WithArgument("x-queue-type", "quorum"), stoppingToken);

        await bus.Advanced.BindAsync(mainExchange, _mainQueue, GSheetsQueueKeys.RoutingKey, stoppingToken);
        await bus.Advanced.BindAsync(_retryExchange, retryQueue, GSheetsQueueKeys.RoutingKey, stoppingToken);
        await bus.Advanced.BindAsync(_errorExchange, errorQueue, GSheetsQueueKeys.RoutingKey, stoppingToken);

        await StartRpcConsumerAsync();
        StartQueueConsumer();

        while (!stoppingToken.IsCancellationRequested)
        {
            logger.LogFileMessage($"GoogleSheetsConsumer (RPC + Queue) running at: {DateTimeOffset.Now}");

            CheckMaintenanceMode();

            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken).ConfigureAwait(false);
        }
    }

    public override void Dispose()
    {
        _rpcConsumerHandle?.Dispose();
        _queueConsumerHandle?.Dispose();
        _rateLimiter.Dispose();
        base.Dispose();
    }
}
