namespace ONEHub.Infrastructure.Data;

public class DynamicRepository : ONEHub.Domain.Interfaces.IDynamicRepository
{
    private readonly Fanex.Data.Repository.DynamicRepository _fanexRepository = new();

    public async Task<T?> GetAsync<T>(object criteria) where T : class
    {
        return await _fanexRepository.GetAsync<T>(criteria as dynamic);
    }

    public async Task<IEnumerable<T>> FetchAsync<T>(object criteria) where T : class
    {
        return await _fanexRepository.FetchAsync<T>(criteria as dynamic);
    }

    public async Task<int> ExecuteAsync(object command)
    {
        return await _fanexRepository.ExecuteAsync(command as dynamic);
    }
}
