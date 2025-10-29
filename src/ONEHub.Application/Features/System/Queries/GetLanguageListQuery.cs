using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.System.Queries;

public record GetLanguageListQuery : IRequest<IEnumerable<LanguageDto>>;

public class GetLanguageListQueryHandler(
    IDynamicRepository repository,
    ICacheService cacheService,
    ILogger<GetLanguageListQueryHandler> logger)
    : IRequestHandler<GetLanguageListQuery, IEnumerable<LanguageDto>>
{
    private const string CacheKey = "LanguageList";

    public async Task<IEnumerable<LanguageDto>> Handle(
        GetLanguageListQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var cached = await cacheService.GetAsync<IEnumerable<LanguageDto>>(CacheKey);
            if (cached != null)
                return cached;

            var results = await repository.FetchAsync<LanguageDto>(new { SpKey = "Aff_TargetCountry_Sel", GetAll = false });
            var languageList = results
                .GroupBy(l => l.LanguageCode)
                .Select(g => g.First())
                .ToList();

            await cacheService.SetAsync(CacheKey, languageList);
            return languageList;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching language list");
            return Enumerable.Empty<LanguageDto>();
        }
    }
}

