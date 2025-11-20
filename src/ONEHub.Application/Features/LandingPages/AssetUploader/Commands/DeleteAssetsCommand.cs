using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Application.Services;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.AssetUploader.Commands;

public class DeleteAssetsCommand : BaseNonResultCommand
{
    public string MediaIds { get; set; } = string.Empty;
}

public class DeleteAssetsCommandHandler(
    IAssetUploaderRepository assetUploaderRepository,
    IFileService fileService)
    : IRequestHandler<DeleteAssetsCommand, Result>
{
    public async Task<Result> Handle(
        DeleteAssetsCommand request,
        CancellationToken cancellationToken)
    {
        var fileNameList = await GetAssetFileNameList(request.UserId, request.MediaIds);

        var param = new DeleteAssetsParam
        {
            MediaIds = request.MediaIds,
            UserId = request.UserId,
            Ip = request.Ip
        };

        var result = await assetUploaderRepository.DeleteAssetsAsync(param);
        if (result.IsSuccess)
        {
            await DeleteFilesAsync(fileNameList);
        }

        return result;
    }

    private async Task<List<string>> GetAssetFileNameList(int userId, string mediaIds)
    {
        var mediaIdList = mediaIds.Split(',');
        var fileNameList = new List<string>();

        foreach (var mediaId in mediaIdList)
        {
            if (int.TryParse(mediaId.Trim(), out var id))
            {
                var result = await assetUploaderRepository.GetAssetDetailAsync(new AssetDetailParam
                {
                    MediaId = id,
                    UserId = userId
                });

                if (result is { IsSuccess: true, Data: not null } && !string.IsNullOrEmpty(result.Data.FileName))
                {
                    fileNameList.Add(result.Data.FileName);
                }
            }
        }

        return fileNameList;
    }

    private async Task DeleteFilesAsync(List<string> fileList)
    {
        foreach (var filePath in fileList)
        {
            await fileService.DeleteFileAsync(filePath);
        }
    }
}

