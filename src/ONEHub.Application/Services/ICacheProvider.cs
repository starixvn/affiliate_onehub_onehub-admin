namespace ONEHub.Application.Services;

public interface ICacheProvider
{
    public Task<T?> GetOrCreateFromCacheAsync<T>(string key, Func<Task<T>> action, TimeSpan? cacheTime);

    public Task<T?> GetValueFromCacheAsync<T>(string key, T? defaultValue = default);

    public Task SetValueToCacheAsync<T>(string key, T value, TimeSpan? cacheTime = null);

    public Task RemoveFromCacheAsync(string key);
}

