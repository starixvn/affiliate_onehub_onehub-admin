using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.CommonDomain.Queries;

public record GetTargetCountryListByDomainQuery(int AffDomainId = 0, int RedirectDomainId = 0) : IRequest<IEnumerable<TargetCountryByDomainDto>>;

public class GetTargetCountryListByDomainQueryHandler(
    IDynamicRepository repository,
    ILogger<GetTargetCountryListByDomainQueryHandler> logger)
    : IRequestHandler<GetTargetCountryListByDomainQuery, IEnumerable<TargetCountryByDomainDto>>
{
    public async Task<IEnumerable<TargetCountryByDomainDto>> Handle(
        GetTargetCountryListByDomainQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<TargetCountryByDomainDto>(new
        {
            AffDomainId = request.AffDomainId,
            RedirectDomainId = request.RedirectDomainId
        });
        return results.ToList();
    }
}

