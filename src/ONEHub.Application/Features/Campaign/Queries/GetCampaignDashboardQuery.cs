using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Campaign.Queries;

public class GetCampaignDashboardQuery : BaseQuery<CampaignDashboardResponse>;

public record CampaignDashboardResponse(int Total, int Draft, int Active, int Inactive, int Paused);

public class GetCampaignDashboardHandler(ICampaignRepository campaignRepository)
    : IRequestHandler<GetCampaignDashboardQuery, Result<CampaignDashboardResponse>>
{
    public async Task<Result<CampaignDashboardResponse>> Handle(GetCampaignDashboardQuery request, CancellationToken cancellationToken)
    {
        var campaignDashboardResult = await campaignRepository.GetCampaignDashboardAsync();

        if (campaignDashboardResult.IsFailure)
        {
            return Result<CampaignDashboardResponse>.Failure(campaignDashboardResult.Error);
        }

        if (campaignDashboardResult.Data is null)
        {
            return Result<CampaignDashboardResponse>.Failure(Error.NoData);
        }

        var data = new CampaignDashboardResponse(
            campaignDashboardResult.Data.TotalCampaigns,
            campaignDashboardResult.Data.DraftCampaigns,
            campaignDashboardResult.Data.ActiveCampaigns,
            campaignDashboardResult.Data.InactiveCampaigns,
            campaignDashboardResult.Data.PausedCampaigns
        );

        return Result<CampaignDashboardResponse>.Success(data);
    }
}
