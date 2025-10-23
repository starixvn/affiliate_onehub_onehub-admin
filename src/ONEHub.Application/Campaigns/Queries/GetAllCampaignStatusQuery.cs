using MediatR;
using ONEHub.Domain.Criterias.Campaigns;
using ONEHub.Domain.DTOs.Campaigns;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Campaigns.Queries;

public record GetAllCampaignStatusQuery : IRequest<IEnumerable<CampaignStatus>>;

public class GetAllCampaignStatusQueryHandler : IRequestHandler<GetAllCampaignStatusQuery, IEnumerable<CampaignStatus>>
{
    private readonly IDynamicRepository _repository;

    public GetAllCampaignStatusQueryHandler(IDynamicRepository repository)
    {
        _repository = repository;
    }

    public async Task<IEnumerable<CampaignStatus>> Handle(GetAllCampaignStatusQuery request, CancellationToken cancellationToken)
    {
        var criteria = new GetAllCampaignStatusCriteria();
        var result = await _repository.FetchAsync<CampaignStatus>(criteria);
        return result;
    }
}
