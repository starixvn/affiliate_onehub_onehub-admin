using System.Text.Json;
using Microsoft.Extensions.Caching.Distributed;
using ONEHub.Application.Services;

namespace ONEHub.Infrastructure.Services;

public class DistributedCacheProvider(IDistributedCache cache) : ICacheProvider
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        WriteIndented = false
    };

    public async Task<T?> GetOrCreateFromCacheAsync<T>(string key, Func<Task<T>> action, TimeSpan? cacheTime)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentNullException.ThrowIfNull(action);

        var cachedData = await cache.GetStringAsync(key);
        if (!string.IsNullOrEmpty(cachedData))
        {
            return JsonSerializer.Deserialize<T>(cachedData, JsonOptions);
        }

        var data = await action();
        if (data is not null)
        {
            await SetValueToCacheAsync(key, data, cacheTime);
        }

        return data;
    }

    public async Task<T?> GetValueFromCacheAsync<T>(string key, T? defaultValue = default)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);

        var cachedData = await cache.GetStringAsync(key);
        return string.IsNullOrEmpty(cachedData)
            ? defaultValue
            : JsonSerializer.Deserialize<T>(cachedData, JsonOptions);
    }

    public async Task RemoveFromCacheAsync(string key)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        await cache.RemoveAsync(key);
    }

    public async Task SetValueToCacheAsync<T>(string key, T value, TimeSpan? cacheTime = null)
    {
        ArgumentException.ThrowIfNullOrWhiteSpace(key);
        ArgumentNullException.ThrowIfNull(value);

        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = cacheTime ?? TimeSpan.FromMinutes(15)
        };

        var json = JsonSerializer.Serialize(value, JsonOptions);
        await cache.SetStringAsync(key, json, options);
    }
}
