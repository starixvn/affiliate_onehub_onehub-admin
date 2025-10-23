using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.SystemManagement.Queries;

public record GetTargetCountryListQuery : IRequest<IEnumerable<TargetCountryDto>>;

public class GetTargetCountryListQueryHandler(
    IDynamicRepository repository,
    ICacheService cacheService,
    ILogger<GetTargetCountryListQueryHandler> logger)
    : IRequestHandler<GetTargetCountryListQuery, IEnumerable<TargetCountryDto>>
{
    private const string CacheKey = "TargetCountryList";

    public async Task<IEnumerable<TargetCountryDto>> Handle(
        GetTargetCountryListQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var cached = await cacheService.GetAsync<IEnumerable<TargetCountryDto>>(CacheKey);
            if (cached != null)
                return cached;

            var results = await repository.FetchAsync<TargetCountryDto>(new { SpKey = "Aff_TargetCountry_Sel" });
            await cacheService.SetAsync(CacheKey, results);
            return results;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching target country list");
            return Enumerable.Empty<TargetCountryDto>();
        }
    }
}

