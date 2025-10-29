using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Common;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.LandingPages.AssetUploader.Queries;

public record GetAssetListQuery(GetAssetUploaderCriteria Criteria) : IRequest<EntityResult<AssetDetail>>;

public class GetAssetListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetAssetListQueryHandler> logger)
    : IRequestHandler<GetAssetListQuery, EntityResult<AssetDetail>>
{
    public async Task<EntityResult<AssetDetail>> Handle(
        GetAssetListQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = await repository.FetchAsync<AssetDetail>(request.Criteria);
            return new EntityResult<AssetDetail>
            {
                MainData = result.ToList(),
                TotalItem = request.Criteria.TotalItem
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting asset list: {@Criteria}", request.Criteria);
            return new EntityResult<AssetDetail>
            {
                MainData = new List<AssetDetail>(),
                TotalItem = 0
            };
        }
    }
}

