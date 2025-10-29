using System.Net;
using System.Text;
using System.Text.RegularExpressions;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;
using UploadCommand = ONEHub.Domain.Commands.LandingPages.UploadAssetsCommand;

namespace ONEHub.Application.Features.LandingPages.AssetUploader.Commands;

public record UploadAssetsCommand(
    IFormFileCollection Files,
    int ModuleId,
    string TargetCountryCode,
    string LanguageCode,
    string InputFileNames,
    string InputMediaNames,
    int UserId,
    string Ip,
    string FunctionName) : IRequest<ResultInfo>;

public class UploadAssetsCommandHandler(
    IDynamicRepository repository,
    IFileService fileService,
    IImageService imageService,
    ILandingPageService landingPageService,
    IConfiguration configuration,
    ILogger<UploadAssetsCommandHandler> logger)
    : IRequestHandler<UploadAssetsCommand, ResultInfo>
{
    private const string DatabaseInsertionFailsMessage = "Database insertion fails";

    public async Task<ResultInfo> Handle(
        UploadAssetsCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var result = fileService.ValidateUploadRequest(request.Files, request.InputFileNames, request.InputMediaNames);
            if (!result.IsSuccessful)
            {
                return result;
            }

            var inputFileNames = fileService.PrepareInputFileNames(request.Files, request.InputFileNames);
            var inputMediaNames = PrepareInputMediaNames(inputFileNames, request.InputMediaNames);

            result = fileService.ValidateAllInputFileNames(inputFileNames, request.Files);
            if (!result.IsSuccessful)
            {
                return result;
            }

            result = landingPageService.ValidateLanguageByTargetCountry(request.LanguageCode, request.TargetCountryCode);
            if (!result.IsSuccessful)
            {
                return result;
            }

            var folder = landingPageService.GetAssetFolder(request.ModuleId, request.TargetCountryCode, request.LanguageCode);
            result = fileService.CheckMultipleFilesInFolder(inputFileNames, folder);
            if (!result.IsSuccessful)
            {
                return result;
            }

            var filePaths = new List<string>();
            var mediaNames = new List<string>();
            var dimensions = new List<string>();

            await ProcessAndUploadFiles(request.Files, inputFileNames, inputMediaNames, folder, filePaths, mediaNames, dimensions);

            return await SaveAssetsToDatabase(
                request.ModuleId,
                request.TargetCountryCode,
                request.LanguageCode,
                request.UserId,
                request.Ip,
                request.FunctionName,
                filePaths,
                mediaNames,
                dimensions);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error uploading assets");
            return ResultInfo.GenerateError("Error uploading assets");
        }
    }

    private string[] PrepareInputMediaNames(string[] inputFileNames, string inputMediaNames)
    {
        if (string.IsNullOrEmpty(inputMediaNames))
        {
            return inputFileNames;
        }

        return inputMediaNames.Split('|');
    }

    private async Task ProcessAndUploadFiles(
        IFormFileCollection files,
        string[] inputFileNames,
        string[] inputMediaNames,
        string folder,
        List<string> filePaths,
        List<string> mediaNames,
        List<string> dimensions)
    {
        var allowedExtensions = (configuration["AppSettings:AllowedImageExtensions"] ?? ".jpg,.jpeg,.png,.gif,.webp")
            .Split(',')
            .Select(e => e.Trim().ToLower())
            .ToArray();

        var extensionPattern = string.Join("|", allowedExtensions.Select(ext => ext.StartsWith(".") ? ext.Substring(1) : ext));
        var extensionRemovalRegex = new Regex(@"\.(" + extensionPattern + ")$", RegexOptions.IgnoreCase);

        for (var i = 0; i < files.Count; i++)
        {
            var file = files[i];
            var fileName = inputFileNames[i];
            var path = $"{folder}/{fileName}";

            using var stream = file.OpenReadStream();
            var dimension = imageService.ExtractImageDimensions(stream);

            var mediaName = inputMediaNames[i];
            if (string.IsNullOrEmpty(mediaName))
            {
                mediaName = extensionRemovalRegex.Replace(fileName, string.Empty);
            }

            mediaNames.Add(mediaName);
            filePaths.Add(path);
            dimensions.Add(dimension);

            await fileService.UploadFileAsync(file, path);
        }
    }

    private async Task<ResultInfo> SaveAssetsToDatabase(
        int moduleId,
        string targetCountryCode,
        string languageCode,
        int userId,
        string ip,
        string functionName,
        List<string> filePaths,
        List<string> mediaNames,
        List<string> dimensions)
    {
        var filesXml = BuildFilesXml(filePaths, mediaNames, dimensions);

        try
        {
            var command = new UploadCommand
            {
                Files = filesXml,
                ModuleId = moduleId,
                TargetCountryCode = WebUtility.HtmlEncode(targetCountryCode),
                LanguageCode = WebUtility.HtmlEncode(languageCode),
                UserId = userId,
                Ip = ip,
                FunctionName = functionName
            };

            var rowsAffected = await repository.ExecuteAsync(command);

            if (rowsAffected <= 0)
            {
                fileService.CleanupUploadedFiles(filePaths);
                return ResultInfo.GenerateError(DatabaseInsertionFailsMessage);
            }

            return ResultInfo.Success;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving assets to database");
            fileService.CleanupUploadedFiles(filePaths);
            return ResultInfo.GenerateError(DatabaseInsertionFailsMessage);
        }
    }

    private static string BuildFilesXml(List<string> filePaths, List<string> mediaNames, List<string> dimensions)
    {
        var result = new StringBuilder();
        result.Append("<root>");

        for (var i = 0; i < filePaths.Count; i++)
        {
            var row = $"<row MediaName=\"{WebUtility.HtmlEncode(mediaNames[i])}\" FileName=\"{WebUtility.HtmlEncode(filePaths[i])}\" Dimension=\"{dimensions[i]}\" />";
            result.Append(row);
        }

        result.Append("</root>");
        return result.ToString();
    }
}

