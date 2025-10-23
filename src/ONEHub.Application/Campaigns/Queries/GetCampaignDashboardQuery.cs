using MediatR;
using ONEHub.Domain.Criterias.Campaigns;
using ONEHub.Domain.DTOs.Campaigns;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Campaigns.Queries;

public record GetCampaignDashboardQuery : IRequest<CampaignDashboard>;

public class GetCampaignDashboardQueryHandler : IRequestHandler<GetCampaignDashboardQuery, CampaignDashboard>
{
    private readonly IDynamicRepository _repository;

    public GetCampaignDashboardQueryHandler(IDynamicRepository repository)
    {
        _repository = repository;
    }

    public async Task<CampaignDashboard> Handle(GetCampaignDashboardQuery request, CancellationToken cancellationToken)
    {
        var criteria = new GetCampaignDashboardCriteria();
        var result = await _repository.GetAsync<CampaignDashboard>(criteria);
        return result;
    }
}
