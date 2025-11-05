using MediatR;
using ONEHub.Domain.Criterias.Components;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Components.Queries;

public record GetTargetCountriesQuery(
    string? TargetCountryCode = null,
    bool IsDefault = false
) : IRequest<IEnumerable<TargetCountry>>;

public class GetTargetCountriesQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetTargetCountriesQuery, IEnumerable<TargetCountry>>
{
    public async Task<IEnumerable<TargetCountry>> Handle(
        GetTargetCountriesQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new GetTargetCountryCriteria
        {
            TargetCountryCode = request.TargetCountryCode ?? string.Empty,
            IsDefault = request.IsDefault
        };

        var results = await repository.FetchAsync<TargetCountry>(criteria);
        return results;
    }
}

