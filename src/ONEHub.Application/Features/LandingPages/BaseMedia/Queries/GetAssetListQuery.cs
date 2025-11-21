using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.BaseMedia.Queries;

public class GetAssetListQuery : PagingQuery<AssetDetail>
{
    public string? MediaName { get; set; } = string.Empty;

    public string? ModuleIds { get; set; } = string.Empty;

    public string? TargetCountryCodes { get; set; } = string.Empty;

    public string? LanguageCodes { get; set; } = string.Empty;

    public int Status { get; set; }

    public string FunctionName { get; set; }
}

public class GetAssetListHandler(
    IAssetUploaderRepository assetUploaderRepository)
    : IRequestHandler<GetAssetListQuery, Result<PagingData<AssetDetail>>>
{
    public async Task<Result<PagingData<AssetDetail>>> Handle(GetAssetListQuery request, CancellationToken cancellationToken)
    {
        var param = new AssetListParam
        {
            MediaName = request.MediaName,
            ModuleIds = request.ModuleIds,
            TargetCountryCodes = request.TargetCountryCodes,
            LanguageCodes = request.LanguageCodes,
            Status = request.Status,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            UserId = request.UserId,
            FunctionName = request.FunctionName
        };

        return await assetUploaderRepository.GetAssetListAsync(param);
    }
}
