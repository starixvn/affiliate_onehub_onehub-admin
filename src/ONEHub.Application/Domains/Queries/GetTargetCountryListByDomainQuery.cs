using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Domains.Queries;

public record GetTargetCountryListByDomainQuery(
    int AffDomainId = 0,
    int RedirectDomainId = 0) : IRequest<IEnumerable<TargetCountryByDomainDto>>;

public class GetTargetCountryListByDomainQueryHandler(
    IDynamicRepository repository,
    ILogger<GetTargetCountryListByDomainQueryHandler> logger)
    : IRequestHandler<GetTargetCountryListByDomainQuery, IEnumerable<TargetCountryByDomainDto>>
{
    public async Task<IEnumerable<TargetCountryByDomainDto>> Handle(
        GetTargetCountryListByDomainQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var results = await repository.FetchAsync<TargetCountryByDomainDto>(new
            {
                AffDomainId = request.AffDomainId,
                RedirectDomainId = request.RedirectDomainId
            });
            return results;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching target country list by domain, AffDomainId: {AffDomainId}, RedirectDomainId: {RedirectDomainId}",
                request.AffDomainId, request.RedirectDomainId);
            return Enumerable.Empty<TargetCountryByDomainDto>();
        }
    }
}

