namespace ONEHub.Application.Services;

public interface IRabbitBus
{
    void SetBus(object bus);

    Task<bool> PublishAsync<T>(T model);

    Task<TResponse?> RequestAsync<TRequest, TResponse>(TRequest request, TimeSpan? timeout = null)
        where TRequest : class
        where TResponse : class;

    Task RegisterQueueAsync();

    bool IsConnected { get; }
}
