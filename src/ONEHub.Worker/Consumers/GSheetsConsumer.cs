using EasyNetQ;
using EasyNetQ.Consumer;
using EasyNetQ.Topology;
using ONEHub.Application.Services;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Params;

namespace ONEHub.Worker.Consumers;

public sealed class GSheetsConsumer(
    IBus bus,
    IGSheetsDataService gSheetsDataService,
    ILogProvider logger) : BackgroundService
{
    private IDisposable? _consumerHandle;
    private readonly SemaphoreSlim _rateLimiter = new(1, 1);
    private const int RATE_LIMIT_DELAY_MILLISECONDS = 1000;
    private const int MAX_RETRY_COUNT = 5;
    private const int TIME_TO_RE_QUEUE = 30000;
    private const int INITIAL_DELAY_MILLISECONDS = 10;

    private Exchange _retryExchange;
    private Exchange _errorExchange;
    private Queue _mainQueue;

    private void StartConsumer()
    {
        _consumerHandle = bus.Advanced.Consume(_mainQueue, async (body, properties, _) =>
        {
            await _rateLimiter.WaitAsync();
            try
            {
                var message = System.Text.Json.JsonSerializer.Deserialize<GSheetsQueueParam>(body.Span);
                if (message == null)
                {
                    logger.LogFileMessage("Failed to deserialize message");
                    return AckStrategies.Ack;
                }

                logger.LogFileMessage($"Processing message: {message}");

                var result = await gSheetsDataService.ProcessDataAsync(message);

                if (result.IsFailure)
                {
                    var errMessage = await ProcessMessageWhenError(body, properties);
                    await logger.SentryErrorAsync($"{errMessage} - {result.ErrorMessage}");
                }
                else
                {
                    logger.LogFileMessage($"Successfully processed message: {message}");
                }

                await Task.Delay(RATE_LIMIT_DELAY_MILLISECONDS);
                return AckStrategies.Ack;
            }
            catch (Exception ex)
            {
                var errMessage = await ProcessMessageWhenError(body, properties);
                await logger.SentryErrorAsync(errMessage, ex);
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

        // Setup exchanges and queues
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

        StartConsumer();

        while (!stoppingToken.IsCancellationRequested)
        {
            logger.LogFileMessage($"GoogleSheetsConsumer running at: {DateTimeOffset.Now}");
            await Task.Delay(TimeSpan.FromMinutes(1), stoppingToken).ConfigureAwait(false);
        }
    }

    public override void Dispose()
    {
        _consumerHandle?.Dispose();
        _rateLimiter.Dispose();
        base.Dispose();
    }
}
