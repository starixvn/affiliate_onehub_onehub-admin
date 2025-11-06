using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.Features.Shared;
using ONEHub.Application.Services;
using ONEHub.Domain.Errors;
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
    IFileService fileService,
    ILogger<DeleteAssetsCommandHandler> logger)
    : IRequestHandler<DeleteAssetsCommand, Result>
{
    public async Task<Result> Handle(
        DeleteAssetsCommand request,
        CancellationToken cancellationToken)
    {
        try
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
        catch (Exception ex)
        {
            logger.LogError(ex, AssetUploaderError.DeleteAssetsFailed.Message);
            return Result.Failure(AssetUploaderError.DeleteAssetsFailed);
        }
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
            try
            {
                await fileService.DeleteFileAsync(filePath);
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to delete file: {FilePath}", filePath);
            }
        }
    }
}

