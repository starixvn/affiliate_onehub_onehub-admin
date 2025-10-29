using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.System.Queries;

public record GetAllLanguagesQuery : IRequest<IEnumerable<LanguageDto>>;

public class GetAllLanguagesQueryHandler(
    IDynamicRepository repository,
    ICacheService cacheService,
    ILogger<GetAllLanguagesQueryHandler> logger)
    : IRequestHandler<GetAllLanguagesQuery, IEnumerable<LanguageDto>>
{
    private const string CacheKey = "AllLanguagesInSystem";

    public async Task<IEnumerable<LanguageDto>> Handle(
        GetAllLanguagesQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var cached = await cacheService.GetAsync<IEnumerable<LanguageDto>>(CacheKey);
            if (cached != null)
                return cached;

            var results = await repository.FetchAsync<LanguageDto>(new { SpKey = "Aff_TargetCountry_Sel", GetAll = false });
            await cacheService.SetAsync(CacheKey, results);
            return results;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching all languages");
            return Enumerable.Empty<LanguageDto>();
        }
    }
}

