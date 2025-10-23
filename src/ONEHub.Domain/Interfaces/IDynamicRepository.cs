namespace ONEHub.Domain.Interfaces;

public interface IDynamicRepository
{
    Task<T?> GetAsync<T>(object criteria) where T : class;
    Task<IEnumerable<T>> FetchAsync<T>(object criteria) where T : class;
    Task<int> ExecuteAsync(object command);
}

