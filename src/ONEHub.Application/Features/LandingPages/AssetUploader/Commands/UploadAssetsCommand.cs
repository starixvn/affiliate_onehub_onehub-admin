using System.Net;
using System.Text.Json;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Commands.LandingPages;
using ONEHub.Domain.Common;
using ONEHub.Domain.DTOs.LandingPages;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.LandingPages.AssetUploader.Commands;

public record UploadAssetsCommand(
    List<ModuleRow> ModuleRows,
    string TargetCountryCode,
    string LanguageCode,
    int UserId,
    string Ip,
    string FunctionName) : IRequest<ResultInfo>;

public class UploadAssetsCommandHandler(
    IStorageService storageService,
    IDynamicRepository repository,
    IFileService fileService,
    IImageService imageService,
    ILandingPageService landingPageService,
    ILogger<UploadAssetsCommandHandler> logger)
    : IRequestHandler<UploadAssetsCommand, ResultInfo>
{
    private const string DATABASE_INSERTION_FAILS_MESSAGE = "Database insertion fails";

    public async Task<ResultInfo> Handle(
        UploadAssetsCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var allFiles = new FormFileCollection();
            foreach (var row in request.ModuleRows)
            {
                if (row.Files.Any())
                {
                    allFiles.AddRange(row.Files);
                }
            }

            var inputFileNames = fileService.PrepareInputFileNames(allFiles, string.Empty);

            var validations = new[]
            {
                fileService.ValidateUploadRequest(allFiles, string.Empty),
                fileService.ValidateAllInputFileNames(inputFileNames),
                landingPageService.ValidateLanguageByTargetCountry(request.LanguageCode, request.TargetCountryCode)
            };

            foreach (var validation in validations)
            {
                if (!validation.IsSuccessful)
                {
                    return validation;
                }
            }

            foreach (var row in request.ModuleRows)
            {
                var folder = landingPageService.GetAssetFolder(
                    row.ModuleId,
                    request.TargetCountryCode,
                    request.LanguageCode
                );

                var folderCheck = fileService.CheckMultipleFilesInFolder(inputFileNames, folder);
                if (!folderCheck.IsSuccessful)
                {
                    return folderCheck;
                }
                await ProcessAndUploadFiles(row.Files, folder);
            }

            return await SaveAssetsToDatabase(
                request.ModuleRows,
                request.TargetCountryCode,
                request.LanguageCode,
                request.UserId,
                request.Ip,
                request.FunctionName);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error uploading assets");
            return ResultInfo.GenerateError("Error uploading assets");
        }
    }

    private async Task ProcessAndUploadFiles(
        IFormFileCollection files,
        string folder)
    {
        foreach (var file in files)
        {
            var fileName = file.FileName;
            var path = $"{folder}/{fileName}";

            await storageService.UploadFileAsync(file, path);
        }
    }

    private async Task<ResultInfo> SaveAssetsToDatabase(
        List<ModuleRow> moduleRows,
        string targetCountryCode,
        string languageCode,
        int userId,
        string ip,
        string functionName)
    {
        var (filePaths, moduleMedias) = await BuildModel(moduleRows, targetCountryCode, languageCode);

        try
        {
            var files = JsonSerializer.Serialize(moduleMedias, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            var command = new CreateAssetsCommand
            {
                Files = files,
                TargetCountryCode = WebUtility.HtmlEncode(targetCountryCode),
                LanguageCode = WebUtility.HtmlEncode(languageCode),
                UserId = userId,
                Ip = ip,
                FunctionName = functionName
            };
            await repository.ExecuteAsync(command);

            if (command.ErrCode != 0)
            {
                fileService.CleanupUploadedFiles(filePaths);
                return ResultInfo.GenerateError(command.ErrMsg);
            }

            return ResultInfo.Success;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving assets to database");
            fileService.CleanupUploadedFiles(filePaths);
            return ResultInfo.GenerateError(DATABASE_INSERTION_FAILS_MESSAGE);
        }
    }

    private async Task<(List<string>, List<ModuleMedia>)> BuildModel(List<ModuleRow> moduleRows, string targetCountryCode, string languageCode)
    {
        var filePaths = new List<string>();
        var moduleMedias = new List<ModuleMedia>();
        foreach (var moduleRow in moduleRows)
        {
            var moduleMedia = new ModuleMedia
            {
                ModuleId = moduleRow.ModuleId,
                Files = []
            };

            var folder = landingPageService.GetAssetFolder(
                moduleRow.ModuleId,
                targetCountryCode,
                languageCode
            );
            foreach (var file in moduleRow.Files)
            {
                await using var stream = file.OpenReadStream();
                var dimension = imageService.ExtractImageDimensions(stream);
                var fileName = $"{folder}/{file.FileName}";

                filePaths.Add(fileName);
                moduleMedia.Files.Add(new MediaItem
                {
                    FileName = WebUtility.HtmlEncode(fileName),
                    MediaName = WebUtility.HtmlEncode(file.FileName),
                    Dimension = dimension,
                });
            }
            moduleMedias.Add(moduleMedia);
        }

        return (filePaths, moduleMedias);
    }
}
