using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Domains.Queries;

public record GetDomainListQuery(bool IsAffDomain = true) : IRequest<IEnumerable<DomainInfoDto>>;

public class GetDomainListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetDomainListQueryHandler> logger)
    : IRequestHandler<GetDomainListQuery, IEnumerable<DomainInfoDto>>
{
    public async Task<IEnumerable<DomainInfoDto>> Handle(
        GetDomainListQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var spKey = request.IsAffDomain
                ? "Aff_Admin_AffiliateDomain_Sel"
                : "Aff_Admin_LicenseeDomain_Sel";

            var results = await repository.FetchAsync<DomainInfoDto>(new { SpKey = spKey });
            return results;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching domain list, IsAffDomain: {IsAffDomain}", request.IsAffDomain);
            return Enumerable.Empty<DomainInfoDto>();
        }
    }
}

