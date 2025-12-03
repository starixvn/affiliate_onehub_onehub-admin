using EasyNetQ;
using ONEHub.Application.Services;

namespace ONEHub.Worker.Jobs;

public class RabbitMqBusHostedService(
    ILogProvider logger,
    IConfiguration configuration,
    IRabbitBus rabbitBus)
    : BackgroundService
{
    private IBus? _bus;
    private readonly SemaphoreSlim _connectionLock = new(1, 1);
    private bool _isConnected;

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var connStr = configuration.GetValue<string>("RabbitMQConnectionString");

        _bus = RabbitHutch.CreateBus(connStr);
        rabbitBus.SetBus(_bus);

        _bus.Advanced.Disconnected += async (_, _) =>
        {
            _isConnected = false;
            await TryConnectToRabbitMqAsync(stoppingToken);
            logger.LogFileMessage("RabbitMQ disconnected.");
        };

        await TryConnectToRabbitMqAsync(stoppingToken);
        logger.LogFileMessage("RabbitMQ connected and ready.");
    }

    public override void Dispose()
    {
        _bus?.Dispose();
        _connectionLock.Dispose();
        GC.SuppressFinalize(this);
        base.Dispose();
    }

    private async Task TryConnectToRabbitMqAsync(CancellationToken stoppingToken)
    {
        if (!await _connectionLock.WaitAsync(0, stoppingToken))
        {
            return;
        }

        while (!stoppingToken.IsCancellationRequested && !_isConnected)
        {
            try
            {
                await rabbitBus.RegisterQueueAsync();
                _isConnected = true;
            }
            catch (Exception ex)
            {
                _isConnected = false;
                await logger.SentryErrorAsync("RabbitMQ connect failed. Retrying in 10s...", ex);
                logger.LogFileError(ex, ex.Message);
                await Task.Delay(TimeSpan.FromSeconds(10), stoppingToken);
            }
        }

        _connectionLock.Release();
    }
}
