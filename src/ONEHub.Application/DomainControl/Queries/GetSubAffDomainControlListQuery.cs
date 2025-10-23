using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.DomainControl.Queries;

public record GetSubAffDomainControlListQuery : IRequest<IEnumerable<string>>;

public class GetSubAffDomainControlListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetSubAffDomainControlListQueryHandler> logger)
    : IRequestHandler<GetSubAffDomainControlListQuery, IEnumerable<string>>
{
    public async Task<IEnumerable<string>> Handle(
        GetSubAffDomainControlListQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var results = await repository.FetchAsync<AffSubDomainDto>(new { });
            return results
                .Select(s => s.AffSubDomain)
                .Where(s => !string.IsNullOrEmpty(s))
                .Distinct();
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching sub-affiliate domain control list");
            return Enumerable.Empty<string>();
        }
    }

    private class AffSubDomainDto
    {
        public string AffDomain { get; set; } = string.Empty;
        public string AffSubDomain => AffDomain?.ToLowerInvariant().Split('.').FirstOrDefault() ?? string.Empty;
    }
}

