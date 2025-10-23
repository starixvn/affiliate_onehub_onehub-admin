using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Common;
using ONEHub.Domain.Criterias.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.SystemManagement.Queries;

public record GetProductListQuery : IRequest<IEnumerable<ProductDto>>;

public class GetProductListQueryHandler(
    IDynamicRepository repository,
    ICacheService cacheService,
    ILogger<GetProductListQueryHandler> logger)
    : IRequestHandler<GetProductListQuery, IEnumerable<ProductDto>>
{
    private const string CacheKey = "ProductList";

    public async Task<IEnumerable<ProductDto>> Handle(
        GetProductListQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var cached = await cacheService.GetAsync<IEnumerable<ProductDto>>(CacheKey);
            if (cached != null)
                return cached;

            var criteria = new SimpleCriteria("Aff_ProductList_Sel");
            var results = await repository.FetchAsync<ProductDto>(criteria);
            await cacheService.SetAsync(CacheKey, results);
            return results;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching product list");
            return Enumerable.Empty<ProductDto>();
        }
    }
}

