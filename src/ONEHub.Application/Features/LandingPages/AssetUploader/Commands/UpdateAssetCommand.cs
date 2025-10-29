using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
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
    IFileService fileService,
    IImageService imageService,
    ILandingPageService landingPageService,
    IConfiguration configuration,
    ILogger<UpdateAssetCommandHandler> logger)
    : IRequestHandler<UpdateAssetCommand, ResultInfo>
{
    private const string AssetNotFoundMessage = "Asset not found.";
    private const string FileAlreadyExistsMessage = "A file with this name {0} already exists on the server. Please use a different name.";
    private const string DefaultDimensions = "0x0";

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
                    Message = AssetNotFoundMessage
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
        var inputMediaName = request.InputMediaName;
        var path = $"{folder}/{inputFileName}";

        var result = await CheckFileInFolderForUpdate(path, oldFilePath, inputFileName);
        if (!result.IsSuccessful)
        {
            return result;
        }

        if (string.IsNullOrEmpty(inputMediaName))
        {
            var allowedExtensions = (configuration["AppSettings:AllowedImageExtensions"] ?? ".jpg,.jpeg,.png,.gif,.webp")
                .Split(',')
                .Select(e => e.Trim().ToLower())
                .ToArray();

            var extensionPattern = string.Join("|", allowedExtensions.Select(ext => ext.StartsWith(".") ? ext.Substring(1) : ext));
            var extensionRemovalRegex = new Regex(@"\.(" + extensionPattern + ")$", RegexOptions.IgnoreCase);

            inputMediaName = extensionRemovalRegex.Replace(inputFileName ?? string.Empty, string.Empty);
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
        if (request.File == null)
        {
            return ResultInfo.GenerateError("File is required");
        }

        using var stream = request.File.OpenReadStream();
        var result = fileService.ValidateFile(request.File.FileName, request.File.Length, stream);
        if (!result.IsSuccessful)
        {
            return result;
        }

        stream.Position = 0;
        var dimension = imageService.ExtractImageDimensions(stream);

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

        var rowsAffected = await repository.ExecuteAsync(command);

        if (rowsAffected > 0)
        {
            fileService.DeleteFile(oldFilePath);
            await fileService.UploadFileAsync(request.File, path);
            return ResultInfo.Success;
        }

        return ResultInfo.GenerateError("Update asset failed");
    }

    private async Task<ResultInfo> ProcessMetadataUpdate(
        UpdateAssetCommand request,
        string path,
        string oldFilePath,
        AssetDetail oldAssetInfo,
        string inputMediaName)
    {
        var dimension = oldAssetInfo.Dimension ?? DefaultDimensions;
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

        var rowsAffected = await repository.ExecuteAsync(command);

        if (rowsAffected > 0 && !string.Equals(path, oldFilePath, StringComparison.CurrentCultureIgnoreCase))
        {
            MoveFile(path, oldFilePath);
        }

        return rowsAffected > 0
            ? ResultInfo.Success
            : ResultInfo.GenerateError("Update asset failed");
    }

    private void MoveFile(string newFilePath, string oldFilePath)
    {
        var bannerFolders = (configuration["AppSettings:BannerFolders"] ?? string.Empty)
            .Split(';')
            .Select(f => f.Trim())
            .Where(f => !string.IsNullOrEmpty(f))
            .ToArray();

        foreach (var serverPath in bannerFolders)
        {
            var oldFullPath = Path.Combine(serverPath, oldFilePath);
            var newFullPath = Path.Combine(serverPath, newFilePath);

            if (File.Exists(oldFullPath))
            {
                var directoryPath = Path.GetDirectoryName(newFullPath);
                if (!string.IsNullOrEmpty(directoryPath) && !Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }

                File.Move(oldFullPath, newFullPath);
            }
        }
    }

    private async Task<ResultInfo> CheckFileInFolderForUpdate(string? filePath, string? oldFilePath, string? fileName)
    {
        if (string.IsNullOrEmpty(filePath))
        {
            return ResultInfo.Success;
        }

        var bannerFolders = (configuration["AppSettings:BannerFolders"] ?? string.Empty)
            .Split(';')
            .Select(f => f.Trim())
            .Where(f => !string.IsNullOrEmpty(f))
            .ToArray();

        foreach (var serverPath in bannerFolders)
        {
            var fullPath = Path.Combine(serverPath, filePath);
            if (File.Exists(fullPath))
            {
                if (!string.IsNullOrEmpty(oldFilePath) &&
                    string.Equals(filePath, oldFilePath, StringComparison.CurrentCultureIgnoreCase))
                {
                    return ResultInfo.Success;
                }

                return new ResultInfo
                {
                    Code = ErrorCodes.ErrTheFileNameAlreadyExists,
                    Message = string.Format(FileAlreadyExistsMessage, fileName)
                };
            }
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

