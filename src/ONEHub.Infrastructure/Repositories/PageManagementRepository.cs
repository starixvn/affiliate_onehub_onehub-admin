using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Commands.LandingPages;
using ONEHub.Infrastructure.Repositories.Criterias.LandingPages;

namespace ONEHub.Infrastructure.Repositories;

public class PageManagementRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), IPageManagementRepository
{
    public async Task<Result<PageManagementDashboard>> GetPageManagementDashboardAsync()
    {
        var criteria = new GetPageManagementDashboardCriteria();

        return await GetDataAsync<PageManagementDashboard>(criteria);
    }

    public async Task<Result<PagingData<LandingPage>>> GetLandingPageListAsync(LandingPageListParam param)
    {
        var criteria = new GetLandingPageListCriteria
        {
            IsExportExcel = param.IsExportExcel,
            PageSize = param.PageSize,
            PageIndex = param.PageIndex,
            Search = param.Search,
            StatusIds = param.StatusIds,
            TargetCountryCodes = param.TargetCountryCodes,
            LanguageCodes = param.LanguageCodes,
            FromDate = param.FromDate,
            ToDate = param.ToDate
        };

        return await FetchPagingDataAsync<LandingPage>(criteria);
    }

    public async Task<Result> UpdateBatchLandingPageStatusAsync(UpdateBatchLandingPageStatusParam param)
    {
        var command = new UpdateBatchLandingPageStatusCommand
        {
            PageIds = param.PageIds,
            StatusId = param.StatusId,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };
        var result = await ExecuteCommandAsync(command);

        return result;
    }

    public async Task<Result> DeleteBatchLandingPageAsync(DeleteBatchLandingPageParam param)
    {
        var command = new DeleteBatchLandingPageCommand
        {
            PageIds = param.PageIds,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };
        var result = await ExecuteCommandAsync(command);

        return result;
    }
}
