using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface IComponentRepository
{
    public Task<Result<List<ComponentSummary>>> GetComponentSummaryAsync();

    public Task<Result<PagingData<Component>>> GetComponentListAsync(ComponentListParam param);
}
