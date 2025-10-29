using MediatR;
using ONEHub.Domain.Criterias.Common;
using ONEHub.Domain.Entities.Operations;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.LandingPages.LandingPageService.Queries;

public record GetLandingPageDealListQuery : IRequest<IEnumerable<NormalDeal>>;

public class GetLandingPageDealListQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetLandingPageDealListQuery, IEnumerable<NormalDeal>>
{
    public async Task<IEnumerable<NormalDeal>> Handle(
        GetLandingPageDealListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<NormalDeal>(new SimpleCriteria("Aff_LandingPage_Deal_Sel"));
        return results;
    }
}

