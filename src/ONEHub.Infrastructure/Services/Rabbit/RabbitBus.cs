using EasyNetQ;
using EasyNetQ.Topology;
using Newtonsoft.Json;
using ONEHub.Application.Services;
using ONEHub.Domain.Constants;

namespace ONEHub.Infrastructure.Services.Rabbit;

public class RabbitBus(ILogProvider logger) : IRabbitBus
{
    private Exchange? _exchange;
    private IBus? _bus;
    private const int DEFAULT_TIMEOUT_SECONDS = 30;

    private IAdvancedBus? AdvancedBus => _bus?.Advanced;

    public bool IsConnected => AdvancedBus?.IsConnected ?? false;

    public void SetBus(object bus) => _bus = bus as IBus;

    public async Task<bool> PublishAsync<T>(T model)
    {
        if (!IsConnected)
        {
            return false;
        }

        try
        {
            if (!_exchange.HasValue)
            {
                await RegisterQueueAsync();
            }

            if (!_exchange.HasValue || AdvancedBus == null)
            {
                return false;
            }

            await AdvancedBus.PublishAsync(
                _exchange.Value,
                routingKey: $"{GSheetsQueueKeys.QueueIdentify}.routing",
                mandatory: true,
                new Message<T>(model)
            ).ConfigureAwait(false);

            return true;
        }
        catch (Exception ex)
        {
            await logger.SentryErrorAsync($"Error publishing object: {JsonConvert.SerializeObject(model)}.", ex);
            _exchange = null;
            return false;
        }
    }

    public async Task RegisterQueueAsync()
    {
        _exchange = await AdvancedBus!.ExchangeDeclareAsync(GSheetsQueueKeys.MainExchangeName, ExchangeType.Direct);
        var queue = await AdvancedBus!.QueueDeclareAsync(GSheetsQueueKeys.MainQueueName, c =>
        {
            c.AsDurable(true);
            c.AsExclusive(false);
            c.AsAutoDelete(false);
            c.WithArgument("x-queue-type", "quorum");
        });

        await AdvancedBus.BindAsync(_exchange.Value, queue, GSheetsQueueKeys.RoutingKey);
    }

    public async Task<TResponse?> RequestAsync<TRequest, TResponse>(TRequest request, TimeSpan? timeout = null)
        where TRequest : class
        where TResponse : class
    {
        if (!IsConnected || _bus == null)
        {
            await logger.SentryErrorAsync("RabbitMQ is not connected for Request-Reply");
            return null;
        }

        try
        {
            var requestTimeout = timeout ?? TimeSpan.FromSeconds(DEFAULT_TIMEOUT_SECONDS);
            var response = await _bus.Rpc.RequestAsync<TRequest, TResponse>(request, configure =>
            {
                configure.WithExpiration(requestTimeout);
            }).ConfigureAwait(false);

            return response;
        }
        catch (TimeoutException ex)
        {
            await logger.SentryErrorAsync($"RabbitMQ Request timeout after {timeout?.TotalSeconds ?? DEFAULT_TIMEOUT_SECONDS}s", ex);
            return null;
        }
        catch (Exception ex)
        {
            await logger.SentryErrorAsync($"RabbitMQ Request failed: {JsonConvert.SerializeObject(request)}", ex);
            return null;
        }
    }
}
