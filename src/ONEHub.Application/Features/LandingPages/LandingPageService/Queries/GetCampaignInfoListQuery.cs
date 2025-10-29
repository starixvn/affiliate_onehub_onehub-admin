using MediatR;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.Entities.Campaigns;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.LandingPages.LandingPageService.Queries;

public record GetCampaignInfoListQuery : IRequest<IEnumerable<CampaignInfo>>;

public class GetCampaignInfoListQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetCampaignInfoListQuery, IEnumerable<CampaignInfo>>
{
    public async Task<IEnumerable<CampaignInfo>> Handle(
        GetCampaignInfoListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<CampaignInfo>(new GetCampaignInfoCriteria());
        return results;
    }
}

