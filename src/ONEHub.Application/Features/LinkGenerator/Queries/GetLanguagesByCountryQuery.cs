using MediatR;
using ONEHub.Domain.Criterias.Components;
using ONEHub.Domain.DTOs.Components;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.LinkGenerator.Queries;

public record GetLanguagesByCountryQuery(string CountryCode) : IRequest<IEnumerable<TargetCountry>>;

public class GetLanguagesByCountryQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetLanguagesByCountryQuery, IEnumerable<TargetCountry>>
{
    public async Task<IEnumerable<TargetCountry>> Handle(
        GetLanguagesByCountryQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new GetTargetCountryCriteria
        {
            TargetCountryCode = request.CountryCode
        };

        var languages = await repository.FetchAsync<TargetCountry>(criteria);
        return languages;
    }
}

