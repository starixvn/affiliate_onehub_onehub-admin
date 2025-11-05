using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface ICampaignRepository
{
    Task<Result<CampaignDashboard>> GetCampaignDashboardAsync();

    Task<Result<PagingData<Campaign>>> GetCampaignListAsync(CampaignListParam param);

    Task<Result> CreateCampaignAsync(CreateCampaignParam param);

    Task<Result> UpdateCampaignAsync(UpdateCampaignParam param);

    Task<Result> UpdateBatchCampaignStatusAsync(UpdateBatchCampaignStatusParam param);

    Task<Result> DeleteBatchCampaignAsync(DeleteBatchCampaignParam param);
}
