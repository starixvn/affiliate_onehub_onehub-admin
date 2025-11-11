namespace ONEHub.Application.Services;

public interface ICacheProvider
{
    Task<T?> GetOrCreateFromCacheAsync<T>(string key, Func<Task<T>> action, TimeSpan? cacheTime);

    Task<T?> GetValueFromCacheAsync<T>(string key, T? defaultValue = default);

    Task SetValueToCacheAsync<T>(string key, T value, TimeSpan? cacheTime = null);

    Task RemoveFromCacheAsync(string key);
}

