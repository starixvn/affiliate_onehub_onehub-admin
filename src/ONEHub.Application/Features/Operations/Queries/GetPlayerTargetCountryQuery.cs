using MediatR;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.Features.Operations.Queries;

public record GetPlayerTargetCountryQuery : IRequest<IEnumerable<TargetCountry>>;

public class GetPlayerTargetCountryQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetPlayerTargetCountryQuery, IEnumerable<TargetCountry>>
{
    public async Task<IEnumerable<TargetCountry>> Handle(
        GetPlayerTargetCountryQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<TargetCountry>(new { });
        return results;
    }
}

