using MediatR;
using ONEHub.Domain.Criterias.Common;
using ONEHub.Domain.Entities.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.LandingPages.LandingPageService.Queries;

public record GetTargetCountryListQuery() : IRequest<IEnumerable<TargetCountry>>;

public class GetTargetCountryListQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetTargetCountryListQuery, IEnumerable<TargetCountry>>
{
    public async Task<IEnumerable<TargetCountry>> Handle(
        GetTargetCountryListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<TargetCountry>(new TargetCountryCriteria());
        return results;
    }
}

