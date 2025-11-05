using System.Net;
using System.Text;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Common;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Interfaces;
using UpdateCommand = ONEHub.Domain.Commands.LandingPages.UpdateAssetCommand;

namespace ONEHub.Application.Features.LandingPages.AssetUploader.Commands;

public record UpdateAssetCommand(
    IFormFile? File,
    int MediaId,
    int ModuleId,
    string TargetCountryCode,
    string LanguageCode,
    string InputFileName,
    string InputMediaName,
    int UserId,
    string Ip,
    string FunctionName) : IRequest<ResultInfo>;

public class UpdateAssetCommandHandler(
    IDynamicRepository repository,
    IStorageService storageService,
    IFileService fileService,
    IImageService imageService,
    ILandingPageService landingPageService,
    ILogger<UpdateAssetCommandHandler> logger)
    : IRequestHandler<UpdateAssetCommand, ResultInfo>
{
    private const string ASSET_NOT_FOUND_MESSAGE = "Asset not found.";
    private const string FILE_ALREADY_EXISTS_MESSAGE = "A file with this name {0} already exists on the server. Please use a different name.";

    public async Task<ResultInfo> Handle(
        UpdateAssetCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var oldAssetCriteria = new GetAssetDetailCriteria
            {
                MediaId = request.MediaId,
                UserId = request.UserId
            };

            var oldAssetInfo = await repository.GetAsync<AssetDetail>(oldAssetCriteria);
            if (oldAssetInfo == null)
            {
                return new ResultInfo
                {
                    Code = ErrorCodes.GeneralErrorCode,
                    Message = ASSET_NOT_FOUND_MESSAGE
                };
            }

            var validationResult = landingPageService.ValidateLanguageByTargetCountry(request.LanguageCode, request.TargetCountryCode);
            if (!validationResult.IsSuccessful)
            {
                return validationResult;
            }

            validationResult = fileService.ValidateInputFileNameForUpdate(request.InputFileName);
            if (!validationResult.IsSuccessful)
            {
                return validationResult;
            }

            validationResult = fileService.ValidateInputMediaNameForUpdate(request.InputMediaName);
            if (!validationResult.IsSuccessful)
            {
                return validationResult;
            }

            return await ProcessAssetUpdate(request, oldAssetInfo);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating asset");
            return ResultInfo.GenerateError("Error updating asset");
        }
    }

    private async Task<ResultInfo> ProcessAssetUpdate(UpdateAssetCommand request, AssetDetail oldAssetInfo)
    {
        var oldFilePath = oldAssetInfo.FileName;
        var folder = landingPageService.GetAssetFolder(request.ModuleId, request.TargetCountryCode, request.LanguageCode);
        var inputFileName = string.IsNullOrEmpty(request.InputFileName) ? request.File?.FileName : request.InputFileName;
        var inputMediaName = request.InputFileName;
        var path = $"{folder}/{inputFileName}";

        var result = await CheckFileInFolderForUpdate(path, oldFilePath, inputFileName);
        if (!result.IsSuccessful)
        {
            return result;
        }

        return request.File != null
            ? await ProcessFileUpdate(request, path, oldFilePath, inputMediaName)
            : await ProcessMetadataUpdate(request, path, oldFilePath, oldAssetInfo, inputMediaName);
    }

    private async Task<ResultInfo> ProcessFileUpdate(
        UpdateAssetCommand request,
        string path,
        string oldFilePath,
        string inputMediaName)
    {
        string dimension;
        await using (var stream = request.File!.OpenReadStream())
        {
            dimension = imageService.ExtractImageDimensions(stream);

            var result = fileService.ValidateFile(request.File.FileName, request.File.Length, stream);
            if (!result.IsSuccessful)
            {
                return result;
            }
        }

        var filesXml = BuildSingleFileXml(inputMediaName, path, dimension);

        var command = new UpdateCommand
        {
            MediaId = request.MediaId,
            ModuleId = request.ModuleId,
            TargetCountryCode = WebUtility.HtmlEncode(request.TargetCountryCode),
            LanguageCode = WebUtility.HtmlEncode(request.LanguageCode),
            Files = filesXml,
            UserId = request.UserId,
            Ip = request.Ip,
            FunctionName = request.FunctionName
        };

        await repository.ExecuteAsync(command);

        if (command.ErrCode == 0)
        {
            await fileService.DeleteFileAsync(oldFilePath);
            await fileService.UploadFileAsync(request.File, path);
            return ResultInfo.Success;
        }

        return ResultInfo.GenerateError(command.ErrMsg);
    }

    private async Task<ResultInfo> ProcessMetadataUpdate(
        UpdateAssetCommand request,
        string path,
        string oldFilePath,
        AssetDetail oldAssetInfo,
        string inputMediaName)
    {
        var dimension = oldAssetInfo.Dimension;
        var filesXml = BuildSingleFileXml(inputMediaName, path, dimension);

        var command = new UpdateCommand
        {
            MediaId = request.MediaId,
            ModuleId = request.ModuleId,
            TargetCountryCode = WebUtility.HtmlEncode(request.TargetCountryCode),
            LanguageCode = WebUtility.HtmlEncode(request.LanguageCode),
            Files = filesXml,
            UserId = request.UserId,
            Ip = request.Ip,
            FunctionName = request.FunctionName
        };

        await repository.ExecuteAsync(command);

        if (command.ErrCode == 0 && !string.Equals(path, oldFilePath, StringComparison.CurrentCultureIgnoreCase))
        {
            await MoveFile(path, oldFilePath);
        }

        return command.ErrCode == 0
            ? ResultInfo.Success
            : ResultInfo.GenerateError(command.ErrMsg);
    }

    private async Task MoveFile(string newFilePath, string oldFilePath)
    {
        _ = await storageService.CopyFileAsync(oldFilePath, newFilePath);
        _ = await storageService.DeleteFileAsync(oldFilePath);
    }

    private async Task<ResultInfo> CheckFileInFolderForUpdate(string? filePath, string? oldFilePath, string? fileName)
    {
        if (string.IsNullOrEmpty(filePath))
        {
            return ResultInfo.Success;
        }

        var fileExisting = await storageService.FileExistsAsync(filePath);
        if (fileExisting)
        {
            if (!string.IsNullOrEmpty(oldFilePath)
                && string.Equals(filePath, oldFilePath, StringComparison.CurrentCultureIgnoreCase))
            {
                return ResultInfo.Success;
            }

            return new ResultInfo
            {
                Code = ErrorCodes.ErrTheFileNameAlreadyExists,
                Message = string.Format(FILE_ALREADY_EXISTS_MESSAGE, fileName)
            };
        }

        return ResultInfo.Success;
    }

    private static string BuildSingleFileXml(string mediaName, string filePath, string dimension)
    {
        var result = new StringBuilder();
        result.Append("<root>");
        result.Append($"<row MediaName=\"{WebUtility.HtmlEncode(mediaName)}\" FileName=\"{WebUtility.HtmlEncode(filePath)}\" Dimension=\"{dimension}\" />");
        result.Append("</root>");
        return result.ToString();
    }
}

