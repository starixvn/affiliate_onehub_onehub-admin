using System.Net;
using System.Text;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ONEHub.Application.Features.Shared;
using ONEHub.Application.Services;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.AssetUploader.Commands;

public class UpdateAssetCommand : BaseNonResultCommand
{
    public IFormFile? File { get; set; }

    public int MediaId { get; set; }

    public int ModuleId { get; set; }

    public string TargetCountryCode { get; set; } = string.Empty;

    public string LanguageCode { get; set; } = string.Empty;

    public string? InputFileName { get; set; } = string.Empty;

    public string? InputMediaName { get; set; } = string.Empty;
}

public class UpdateAssetCommandHandler(
    IAssetUploaderRepository assetUploaderRepository,
    IStorageService storageService,
    IFileService fileService,
    IImageService imageService,
    ILandingPageService landingPageService,
    ILogger<UpdateAssetCommandHandler> logger)
    : IRequestHandler<UpdateAssetCommand, Result>
{
    public async Task<Result> Handle(
        UpdateAssetCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var oldAssetResult = await assetUploaderRepository.GetAssetDetailAsync(new AssetDetailParam
            {
                MediaId = request.MediaId,
                UserId = request.UserId
            });

            var oldAssetInfo = oldAssetResult.Data;
            if (oldAssetInfo == null)
            {
                return Result.Failure(Error.NoData);
            }

            var validationResult = await landingPageService.ValidateLanguageByTargetCountry(request.LanguageCode, request.TargetCountryCode);
            if (validationResult.IsFailure)
            {
                return Result.Failure(new Error(validationResult.ErrorCode, validationResult.ErrorMessage));
            }

            validationResult = fileService.ValidateInputFileNameForUpdate(request.InputFileName);
            if (validationResult.IsFailure)
            {
                return Result.Failure(new Error(validationResult.ErrorCode, validationResult.ErrorMessage));
            }

            validationResult = fileService.ValidateInputMediaNameForUpdate(request.InputMediaName);
            if (validationResult.IsFailure)
            {
                return Result.Failure(new Error(validationResult.ErrorCode, validationResult.ErrorMessage));
            }

            return await ProcessAssetUpdate(request, oldAssetInfo);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, AssetUploaderError.UpdateAssetFailed.Message);
            return Result.Failure(AssetUploaderError.UpdateAssetFailed);
        }
    }

    private async Task<Result> ProcessAssetUpdate(UpdateAssetCommand request, AssetDetail oldAssetInfo)
    {
        var oldFilePath = oldAssetInfo.FileName;
        var folder = await landingPageService.GetAssetFolder(request.ModuleId, request.TargetCountryCode, request.LanguageCode);
        var inputFileName = string.IsNullOrEmpty(request.InputFileName) ? request.File?.FileName : request.InputFileName;
        var inputMediaName = string.IsNullOrWhiteSpace(request.InputMediaName) ? inputFileName : request.InputMediaName;
        var path = $"{folder}/{inputFileName}";

        var result = await CheckFileInFolderForUpdate(path, oldFilePath, inputFileName);
        if (result.IsFailure)
        {
            return Result.Failure(new Error(result.ErrorCode, result.ErrorMessage));
        }

        return request.File != null
            ? await ProcessFileUpdate(request, path, oldFilePath, inputMediaName)
            : await ProcessMetadataUpdate(request, path, oldFilePath, oldAssetInfo, inputMediaName);
    }

    private async Task<Result> ProcessFileUpdate(
        UpdateAssetCommand request,
        string path,
        string oldFilePath,
        string inputMediaName)
    {
        string dimension;
        await using (var stream = request.File!.OpenReadStream())
        {
            stream.Position = 0;
            dimension = imageService.ExtractImageDimensions(stream);

            var validateFile = fileService.ValidateFile(request.File.FileName, request.File.Length, stream);
            if (validateFile.IsFailure)
            {
                return Result.Failure(new Error(validateFile.ErrorCode, validateFile.ErrorMessage));
            }
        }

        var filesXml = BuildSingleFileXml(inputMediaName, path, dimension);

        var param = new UpdateAssetParam
        {
            MediaId = request.MediaId,
            ModuleId = request.ModuleId,
            TargetCountryCode = WebUtility.HtmlEncode(request.TargetCountryCode),
            LanguageCode = WebUtility.HtmlEncode(request.LanguageCode),
            Files = filesXml,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host
        };

        var result = await assetUploaderRepository.UpdateAssetAsync(param);

        if (result.IsSuccess)
        {
            await fileService.DeleteFileAsync(oldFilePath);
            await fileService.UploadFileAsync(request.File, path);
        }

        return result;
    }

    private async Task<Result> ProcessMetadataUpdate(
        UpdateAssetCommand request,
        string path,
        string oldFilePath,
        AssetDetail oldAssetInfo,
        string inputMediaName)
    {
        var dimension = oldAssetInfo.Dimension;
        var filesXml = BuildSingleFileXml(inputMediaName, path, dimension);

        var param = new UpdateAssetParam
        {
            MediaId = request.MediaId,
            ModuleId = request.ModuleId,
            TargetCountryCode = WebUtility.HtmlEncode(request.TargetCountryCode),
            LanguageCode = WebUtility.HtmlEncode(request.LanguageCode),
            Files = filesXml,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host
        };

        var result = await assetUploaderRepository.UpdateAssetAsync(param);

        if (result.IsSuccess && !string.Equals(path, oldFilePath, StringComparison.CurrentCultureIgnoreCase))
        {
            await MoveFile(path, oldFilePath);
        }

        return result;
    }

    private async Task MoveFile(string newFilePath, string oldFilePath)
    {
        _ = await storageService.CopyFileAsync(oldFilePath, newFilePath);
        _ = await storageService.DeleteFileAsync(oldFilePath);
    }

    private async Task<Result> CheckFileInFolderForUpdate(string? filePath, string? oldFilePath, string? fileName)
    {
        if (string.IsNullOrEmpty(filePath))
        {
            return Result.Success();
        }

        var fileExisting = await storageService.FileExistsAsync(filePath);
        if (fileExisting)
        {
            if (!string.IsNullOrEmpty(oldFilePath)
                && string.Equals(filePath, oldFilePath, StringComparison.CurrentCultureIgnoreCase))
            {
                return Result.Success();
            }

            return Result.Failure(AssetUploaderError.FileAlreadyExists with
            {
                Message = string.Format(AssetUploaderError.FileAlreadyExists.Message, fileName)
            });
        }

        return Result.Success();
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
