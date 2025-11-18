using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Commands;
using ONEHub.Infrastructure.Repositories.Criterias;

namespace ONEHub.Infrastructure.Repositories;

public class AssetUploaderRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), IAssetUploaderRepository
{
    public async Task<Result<PagingData<AssetDetail>>> GetAssetListAsync(AssetListParam param)
    {
        var criteria = new GetAssetListCriteria
        {
            MediaName = param.MediaName,
            ModuleIds = param.ModuleIds,
            TargetCountryCodes = param.TargetCountryCodes,
            LanguageCodes = param.LanguageCodes,
            Status = param.Status,
            MediaId = param.MediaId,
            PageIndex = param.PageIndex,
            PageSize = param.PageSize,
            UserId = param.UserId,
            FunctionName = param.FunctionName
        };

        return await FetchPagingDataAsync<AssetDetail>(criteria);
    }

    public async Task<Result<AssetDetail>> GetAssetDetailAsync(AssetDetailParam param)
    {
        var criteria = new GetAssetDetailCriteria
        {
            MediaId = param.MediaId,
            UserId = param.UserId
        };

        return await GetDataAsync<AssetDetail>(criteria);
    }

    public async Task<Result> UploadAssetsAsync(UploadAssetsParam param)
    {
        var command = new CreateAssetsCommand
        {
            Files = param.Files,
            TargetCountryCode = param.TargetCountryCode,
            LanguageCode = param.LanguageCode,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };

        return await ExecuteCommandAsync(command);
    }

    public async Task<Result> UpdateAssetAsync(UpdateAssetParam param)
    {
        var command = new UpdateAssetCommand
        {
            MediaId = param.MediaId,
            ModuleId = param.ModuleId,
            TargetCountryCode = param.TargetCountryCode,
            LanguageCode = param.LanguageCode,
            Files = param.Files,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };

        return await ExecuteCommandAsync(command);
    }

    public async Task<Result> DeleteAssetsAsync(DeleteAssetsParam param)
    {
        var command = new DeleteAssetsCommand
        {
            MediaIds = param.MediaIds,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };

        return await ExecuteCommandAsync(command);
    }

    public async Task<Result> UpdateAssetStatusAsync(UpdateAssetStatusParam param)
    {
        var command = new UpdateAssetsStatusCommand
        {
            MediaIds = param.MediaIds,
            StatusId = param.StatusId,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };

        return await ExecuteCommandAsync(command);
    }
}
