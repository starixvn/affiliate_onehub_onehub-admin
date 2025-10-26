using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Common;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Interfaces;
using DeleteCommand = ONEHub.Domain.Commands.LandingPages.DeleteAssetsCommand;

namespace ONEHub.Application.LandingPages.AssetUploader.Commands;

public record DeleteAssetsCommand(
    string MediaIds,
    int UserId,
    string Ip,
    string FunctionName) : IRequest<ResultInfo>;

public class DeleteAssetsCommandHandler(
    IDynamicRepository repository,
    IFileService fileService,
    ILogger<DeleteAssetsCommandHandler> logger)
    : IRequestHandler<DeleteAssetsCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        DeleteAssetsCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var fileNameList = await GetAssetFileNameList(request.UserId, request.MediaIds);

            var command = new DeleteCommand
            {
                MediaIds = request.MediaIds,
                UserId = request.UserId,
                Ip = request.Ip,
                FunctionName = request.FunctionName
            };

            var rowsAffected = await repository.ExecuteAsync(command);

            if (rowsAffected > 0)
            {
                DeleteFiles(fileNameList);
                return ResultInfo.Success;
            }

            return ResultInfo.GenerateError("Delete assets failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting assets: {@MediaIds}", request.MediaIds);
            return ResultInfo.GenerateError("Error deleting assets");
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
                var criteria = new GetAssetDetailCriteria
                {
                    MediaId = id,
                    UserId = userId
                };

                var assetInfo = await repository.GetAsync<AssetDetail>(criteria);
                if (assetInfo != null && !string.IsNullOrEmpty(assetInfo.FileName))
                {
                    fileNameList.Add(assetInfo.FileName);
                }
            }
        }

        return fileNameList;
    }

    private void DeleteFiles(List<string> fileList)
    {
        foreach (var filePath in fileList)
        {
            try
            {
                fileService.DeleteFile(filePath);
            }
            catch (Exception ex)
            {
                logger.LogWarning(ex, "Failed to delete file: {FilePath}", filePath);
            }
        }
    }
}

