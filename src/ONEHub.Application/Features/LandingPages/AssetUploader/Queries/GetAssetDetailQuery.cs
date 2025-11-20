using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.AssetUploader.Queries;

public class GetAssetDetailQuery : BaseQuery<AssetDetail>
{
    public int MediaId { get; set; }
}

public class GetAssetDetailHandler(
    IAssetUploaderRepository assetUploaderRepository)
    : IRequestHandler<GetAssetDetailQuery, Result<AssetDetail>>
{
    public async Task<Result<AssetDetail>> Handle(GetAssetDetailQuery request, CancellationToken cancellationToken)
    {
        var param = new AssetDetailParam
        {
            MediaId = request.MediaId,
            UserId = request.UserId
        };

        return await assetUploaderRepository.GetAssetDetailAsync(param);
    }
}
