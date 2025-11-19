using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface IComponentRepository
{
    public Task<Result<List<ComponentSummary>>> GetComponentSummaryAsync();

    public Task<Result<PagingData<Component>>> GetComponentListAsync(ComponentListParam param);

    public Task<Result> CreateComponentAsync(CreateComponentParam param);

    public Task<Result> UpdateComponentAsync(UpdateComponentParam param);

    public Task<Result> UpdateBatchComponentStatusAsync(UpdateBatchComponentStatusParam param);

    public Task<Result> DeleteBatchComponentAsync(DeleteBatchComponentParam param);

    public Task<Result<IEnumerable<Component>>> GetComponentByCategoryAsync(GetComponentByCategoryParam param);
}
