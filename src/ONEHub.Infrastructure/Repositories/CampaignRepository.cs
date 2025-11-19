using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Commands;
using ONEHub.Infrastructure.Repositories.Criterias;

namespace ONEHub.Infrastructure.Repositories;

public class CampaignRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), ICampaignRepository
{
    public async Task<Result<CampaignDashboard>> GetCampaignDashboardAsync()
    {
        var criteria = new GetCampaignDashboardCriteria();
        return await GetDataAsync<CampaignDashboard>(criteria);
    }

    public async Task<Result<PagingData<Campaign>>> GetCampaignListAsync(CampaignListParam param)
    {
        var criteria = new GetCampaignListCriteria
        {
            IsExportExcel = param.IsExportExcel,
            PageSize = param.PageSize,
            PageIndex = param.PageIndex,
            Search = param.Search,
            StatusIds = param.StatusIds
        };

        return await FetchPagingDataAsync<Campaign>(criteria);
    }

    public async Task<Result> CreateCampaignAsync(CreateCampaignParam param)
    {
        var command = new CreateCampaignCommand
        {
            CampaignName = param.CampaignName,
            Description = param.Description,
            StatusId = param.StatusId,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };
        var result = await ExecuteCommandAsync(command);

        return result;
    }

    public async Task<Result> UpdateCampaignAsync(UpdateCampaignParam param)
    {
        var command = new UpdateCampaignCommand
        {
            CampaignId = param.CampaignId,
            CampaignName = param.CampaignName,
            Description = param.Description,
            StatusId = param.StatusId,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };
        var result = await ExecuteCommandAsync(command);

        return result;
    }

    public async Task<Result> UpdateBatchCampaignStatusAsync(UpdateBatchCampaignStatusParam param)
    {
        var command = new UpdateBatchCampaignStatusCommand
        {
            CampaignIds = param.CampaignIds,
            StatusId = param.StatusId,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };
        var result = await ExecuteCommandAsync(command);

        return result;
    }

    public async Task<Result> DeleteBatchCampaignAsync(DeleteBatchCampaignParam param)
    {
        var command = new DeleteBatchCampaignCommand
        {
            CampaignIds = param.CampaignIds,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };
        var result = await ExecuteCommandAsync(command);

        return result;
    }

    public async Task<Result<IEnumerable<CampaignBase>>> GetCampaignInfoAsync(GetCampaignInfoParam param)
    {
        var criteria = new GetCampaignInfoCriteria
        {
            CampaignId = param.CampaignId,
            StatusIds = param.StatusIds
        };

        return await FetchDataAsync<CampaignBase>(criteria);
    }
}
