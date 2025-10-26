using MediatR;
using ONEHub.Domain.Criterias.Campaigns;
using ONEHub.Domain.DTOs.Campaigns;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Campaigns.Queries;

public record GetAllCampaignStatusQuery : IRequest<IEnumerable<CampaignStatus>>;

public class GetAllCampaignStatusQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetAllCampaignStatusQuery, IEnumerable<CampaignStatus>>
{
    public async Task<IEnumerable<CampaignStatus>> Handle(GetAllCampaignStatusQuery request, CancellationToken cancellationToken)
    {
        var criteria = new GetAllCampaignStatusCriteria();
        var result = await repository.FetchAsync<CampaignStatus>(criteria);
        return result;
    }
}
