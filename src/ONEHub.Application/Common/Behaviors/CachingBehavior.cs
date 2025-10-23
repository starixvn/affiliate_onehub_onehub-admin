using MediatR;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Text;

namespace ONEHub.Application.Common.Behaviors;

public class CachingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>
{
    private readonly IDistributedCache _cache;
    private readonly ILogger<CachingBehavior<TRequest, TResponse>> _logger;
    private const int DefaultCacheExpirationMinutes = 30;

    public CachingBehavior(
        IDistributedCache cache,
        ILogger<CachingBehavior<TRequest, TResponse>> logger)
    {
        _cache = cache;
        _logger = logger;
    }

    public async Task<TResponse> Handle(
        TRequest request,
        RequestHandlerDelegate<TResponse> next,
        CancellationToken cancellationToken)
    {
        if (!ShouldCache(request))
        {
            return await next();
        }

        var cacheKey = GenerateCacheKey(request);

        var cachedResponse = await GetFromCacheAsync(cacheKey, cancellationToken);
        if (cachedResponse != null)
        {
            _logger.LogInformation(
                "Cache Hit: {RequestName} - Key: {CacheKey}",
                typeof(TRequest).Name,
                cacheKey);

            return cachedResponse;
        }

        var response = await next();

        await SetCacheAsync(cacheKey, response, cancellationToken);

        _logger.LogInformation(
            "Cache Miss: {RequestName} - Key: {CacheKey} - Cached for {ExpirationMinutes} minutes",
            typeof(TRequest).Name,
            cacheKey,
            DefaultCacheExpirationMinutes);

        return response;
    }

    private static bool ShouldCache(TRequest request)
    {
        return request is BaseQuery<TResponse>;
    }

    private static string GenerateCacheKey(TRequest request)
    {
        var requestName = typeof(TRequest).Name;
        var requestJson = JsonConvert.SerializeObject(request);
        var requestHash = Convert.ToBase64String(
            System.Security.Cryptography.SHA256.HashData(Encoding.UTF8.GetBytes(requestJson)));

        return $"{requestName}:{requestHash}";
    }

    private async Task<TResponse?> GetFromCacheAsync(string key, CancellationToken cancellationToken)
    {
        try
        {
            var cachedData = await _cache.GetStringAsync(key, cancellationToken);

            if (string.IsNullOrEmpty(cachedData))
            {
                return default;
            }

            return JsonConvert.DeserializeObject<TResponse>(cachedData);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error retrieving from cache - Key: {CacheKey}", key);
            return default;
        }
    }

    private async Task SetCacheAsync(string key, TResponse response, CancellationToken cancellationToken)
    {
        try
        {
            var options = new DistributedCacheEntryOptions
            {
                AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(DefaultCacheExpirationMinutes)
            };

            var serializedData = JsonConvert.SerializeObject(response);
            await _cache.SetStringAsync(key, serializedData, options, cancellationToken);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error setting cache - Key: {CacheKey}", key);
        }
    }
}

