using MediatR;
using ONEHub.Domain.Criterias.Operations;
using ONEHub.Domain.Entities.Operations;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.LandingPages.LandingPageService.Queries;

public record GetNormalDealListQuery : IRequest<IEnumerable<NormalDeal>>;

public class GetNormalDealListQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetNormalDealListQuery, IEnumerable<NormalDeal>>
{
    public async Task<IEnumerable<NormalDeal>> Handle(
        GetNormalDealListQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new GetAssignDealCriteria
        {
            AffId = -1,
            IsOnlyRevenue = true
        };

        var results = await repository.FetchAsync<NormalDeal>(criteria);
        return results;
    }
}

