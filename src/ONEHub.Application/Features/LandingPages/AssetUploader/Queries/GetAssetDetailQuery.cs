using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.LandingPages.AssetUploader.Queries;

public record GetAssetDetailQuery(GetAssetDetailCriteria Criteria) : IRequest<AssetDetail?>;

public class GetAssetDetailQueryHandler(
    IDynamicRepository repository,
    ILogger<GetAssetDetailQueryHandler> logger)
    : IRequestHandler<GetAssetDetailQuery, AssetDetail?>
{
    public async Task<AssetDetail?> Handle(
        GetAssetDetailQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            return await repository.GetAsync<AssetDetail>(request.Criteria);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error getting asset detail: {@Criteria}", request.Criteria);
            return null;
        }
    }
}

