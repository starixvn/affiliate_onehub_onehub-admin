namespace ONEHub.Application.Services;

public interface IRabbitBus
{
    void SetBus(object bus);

    Task<bool> PublishAsync<T>(T model);

    Task RegisterQueueAsync();

    bool IsConnected { get; }
}
