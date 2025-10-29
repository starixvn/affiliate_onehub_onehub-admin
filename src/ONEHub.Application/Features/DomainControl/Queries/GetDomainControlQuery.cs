using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.DomainControl.Queries;

public record GetDomainControlQuery(string TargetCountryCode, int DomainControlId = 0)
    : IRequest<IEnumerable<DomainControlInfoDto>>;

public class GetDomainControlQueryHandler(
    IDynamicRepository repository,
    ILogger<GetDomainControlQueryHandler> logger)
    : IRequestHandler<GetDomainControlQuery, IEnumerable<DomainControlInfoDto>>
{
    public async Task<IEnumerable<DomainControlInfoDto>> Handle(
        GetDomainControlQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var results = await repository.FetchAsync<DomainControlInfoDto>(new
            {
                request.TargetCountryCode,
                request.DomainControlId
            });
            return results;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching domain control for TargetCountry: {Code}, Id: {Id}",
                request.TargetCountryCode, request.DomainControlId);
            return Enumerable.Empty<DomainControlInfoDto>();
        }
    }
}

