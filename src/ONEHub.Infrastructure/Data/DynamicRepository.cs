using Microsoft.Extensions.Logging;

namespace ONEHub.Infrastructure.Data;

public class DynamicRepository : ONEHub.Domain.Interfaces.IDynamicRepository
{
    private readonly Fanex.Data.Repository.DynamicRepository _fanexRepository;
    private readonly ILogger<DynamicRepository> _logger;
    private readonly ONEHub.Domain.Interfaces.ILogProvider? _logProvider;

    public DynamicRepository(
        ILogger<DynamicRepository> logger,
        ONEHub.Domain.Interfaces.ILogProvider? logProvider = null)
    {
        _fanexRepository = new Fanex.Data.Repository.DynamicRepository();
        _logger = logger;
        _logProvider = logProvider;
    }

    public async Task<T?> GetAsync<T>(object criteria) where T : class
    {
        try
        {
            return await ExecuteWithFanexRepository(async () => await _fanexRepository.GetAsync<T>(criteria as dynamic));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing GetAsync with criteria {CriteriaType}", criteria.GetType().Name);
            if (_logProvider != null)
            {
                await _logProvider.SentryErrorAsync($"GetAsync failed for {criteria.GetType().Name}", ex);
            }
            throw;
        }
    }

    public async Task<IEnumerable<T>> FetchAsync<T>(object criteria) where T : class
    {
        try
        {
            return await ExecuteWithFanexRepository(async () => await _fanexRepository.FetchAsync<T>(criteria as dynamic));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing FetchAsync with criteria {CriteriaType}", criteria.GetType().Name);
            if (_logProvider != null)
            {
                await _logProvider.SentryErrorAsync($"FetchAsync failed for {criteria.GetType().Name}", ex);
            }
            throw;
        }
    }

    public async Task<int> ExecuteAsync(object command)
    {
        try
        {
            return await ExecuteWithFanexRepository(async () => await _fanexRepository.ExecuteAsync(command as dynamic));
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error executing ExecuteAsync with command {CommandType}", command.GetType().Name);
            if (_logProvider != null)
            {
                await _logProvider.SentryErrorAsync($"ExecuteAsync failed for {command.GetType().Name}", ex);
            }
            throw;
        }
    }

    private async Task<TResult> ExecuteWithFanexRepository<TResult>(Func<Task<TResult>> operation)
    {
        return await operation();
    }
}

