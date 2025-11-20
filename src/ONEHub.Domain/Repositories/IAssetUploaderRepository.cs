using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface IAssetUploaderRepository
{
    Task<Result<PagingData<AssetDetail>>> GetAssetListAsync(AssetListParam param);

    Task<Result<AssetDetail>> GetAssetDetailAsync(AssetDetailParam param);

    Task<Result> UploadAssetsAsync(UploadAssetsParam param);

    Task<Result> UpdateAssetAsync(UpdateAssetParam param);

    Task<Result> DeleteAssetsAsync(DeleteAssetsParam param);

    Task<Result> UpdateAssetStatusAsync(UpdateAssetStatusParam param);
}
