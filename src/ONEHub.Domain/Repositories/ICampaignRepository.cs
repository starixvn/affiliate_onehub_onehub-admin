using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface ICampaignRepository
{
    public Task<Result<CampaignDashboard>> GetCampaignDashboardAsync();

    public Task<Result<PagingData<Campaign>>> GetCampaignListAsync(CampaignListParam param);

    public Task<Result<CampaignBase>> CreateCampaignAsync(CreateCampaignParam param);

    public Task<Result> UpdateCampaignAsync(UpdateCampaignParam param);

    public Task<Result> UpdateBatchCampaignStatusAsync(UpdateBatchCampaignStatusParam param);

    public Task<Result> DeleteBatchCampaignAsync(DeleteBatchCampaignParam param);

    public Task<Result<IEnumerable<CampaignBase>>> GetCampaignInfoAsync(GetCampaignInfoParam param);
}
