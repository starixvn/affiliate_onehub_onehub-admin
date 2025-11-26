using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface IPageManagementRepository
{
    public Task<Result<PagingDataWithDashboard<LandingPage, PageManagementDashboard>>> GetLandingPageListAsync(LandingPageListParam param);

    public Task<Result> UpdateBatchLandingPageStatusAsync(UpdateBatchLandingPageStatusParam param);

    public Task<Result> DeleteBatchLandingPageAsync(DeleteBatchLandingPageParam param);
}
