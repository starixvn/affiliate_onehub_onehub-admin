using MediatR;
using ONEHub.Domain.Criterias.Campaigns;
using ONEHub.Domain.DTOs.Campaigns;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Campaigns.Queries;

public record GetCampaignDashboardQuery : IRequest<CampaignDashboard>;

public class GetCampaignDashboardQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetCampaignDashboardQuery, CampaignDashboard>
{
    public async Task<CampaignDashboard> Handle(GetCampaignDashboardQuery request, CancellationToken cancellationToken)
    {
        var criteria = new GetCampaignDashboardCriteria();
        var result = await repository.GetAsync<CampaignDashboard>(criteria);
        return result;
    }
}
