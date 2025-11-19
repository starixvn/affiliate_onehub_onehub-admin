using System.Net;
using System.Text.Json;
using Fanex.Logging;
using MediatR;
using Microsoft.AspNetCore.Http;
using ONEHub.Application.Features.Shared;
using ONEHub.Application.Services;
using ONEHub.Application.Utils;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.AssetUploader.Commands;

public class UploadAssetsCommand : BaseNonResultCommand
{
    public List<ModuleRow>? ModuleRows { get; set; } = [];

    public string TargetCountryCode { get; set; } = string.Empty;

    public string LanguageCode { get; set; } = string.Empty;
}

public class UploadAssetsCommandHandler(
    IStorageService storageService,
    IAssetUploaderRepository assetUploaderRepository,
    IFileService fileService,
    IImageService imageService,
    ILandingPageService landingPageService,
    ILogger logger)
    : IRequestHandler<UploadAssetsCommand, Result>
{
    public async Task<Result> Handle(
        UploadAssetsCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var modulesWithoutFilesValidation = ValidateModulesWithoutFiles(request.ModuleRows);
            if (modulesWithoutFilesValidation.IsFailure)
            {
                return modulesWithoutFilesValidation;
            }

            var allFiles = new FormFileCollection();

            allFiles.AddRange(request.ModuleRows!
                .Where(row => row.Files.Any())
                .SelectMany(row => row.Files));

            var inputMediaNames = request.ModuleRows!
                .Where(r => !string.IsNullOrWhiteSpace(r.InputMediaNames))
                .SelectMany(r => r.InputMediaNames.Split('|', StringSplitOptions.RemoveEmptyEntries))
                .ToArray();
            var inputFileNames = fileService.PrepareInputFileNames(allFiles, string.Empty);

            var uploadValidation = fileService.ValidateUploadRequest(
                allFiles,
                string.Join("|", inputFileNames),
                string.Join("|", inputMediaNames)
            );

            if (uploadValidation.IsFailure)
            {
                return uploadValidation;
            }

            var fileNameValidation = ValidateInputNames(inputFileNames, inputMediaNames);
            if (fileNameValidation.IsFailure)
            {
                return fileNameValidation;
            }

            var languageValidation = await landingPageService.ValidateLanguageByTargetCountry(request.LanguageCode, request.TargetCountryCode);
            if (languageValidation.IsFailure)
            {
                return languageValidation;
            }

            foreach (var row in request.ModuleRows)
            {
                var folder = await landingPageService.GetAssetFolder(
                    row.ModuleId,
                    request.TargetCountryCode,
                    request.LanguageCode
                );

                var folderCheck = await fileService.CheckMultipleFilesInFolderAsync(inputFileNames, folder);
                if (folderCheck.IsFailure)
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
                request.Host);
        }
        catch (Exception ex)
        {
            await logger.ErrorAsync(LoggerUtils.GenerateMessage(ex));
            return Result.Failure(AssetUploaderError.UploadAssetsFailed);
        }
    }

    private Result ValidateModulesWithoutFiles(List<ModuleRow> moduleRows)
    {
        var emptyModuleIndexes = new List<int>();

        for (var index = 0; index < moduleRows.Count; index++)
        {
            var moduleRow = moduleRows[index];
            if (moduleRow.Files == null || !moduleRow.Files.Any())
            {
                emptyModuleIndexes.Add(index);
            }
        }

        if (emptyModuleIndexes.Any())
        {
            var moduleIndexesString = string.Join(", ", emptyModuleIndexes);
            return Result.Failure(AssetUploaderError.ModulesWithoutFiles with
            {
                Message = string.Format(AssetUploaderError.ModulesWithoutFiles.Message, moduleIndexesString)
            });
        }

        return Result.Success();
    }

    private Result ValidateInputNames(string[] inputFileNames, string[]? inputMediaNames)
    {
        var fileNameValidation = fileService.ValidateAllInputFileNames(inputFileNames);
        if (fileNameValidation.IsFailure)
        {
            return fileNameValidation;
        }

        return inputMediaNames == null ? Result.Success() : fileService.ValidateAllInputFileNames(inputMediaNames, "Form");
    }

    private async Task ProcessAndUploadFiles(
        List<IFormFile> files,
        string folder)
    {
        foreach (var file in files)
        {
            var fileName = file.FileName;
            var path = $"{folder}/{fileName}";

            await storageService.UploadFileAsync(file, path);
        }
    }

    private async Task<Result> SaveAssetsToDatabase(
        List<ModuleRow>? moduleRows,
        string targetCountryCode,
        string languageCode,
        int userId,
        string ip,
        string host)
    {
        var (filePaths, moduleMedias) = await BuildModel(moduleRows, targetCountryCode, languageCode);

        try
        {
            var files = JsonSerializer.Serialize(moduleMedias, new JsonSerializerOptions
            {
                WriteIndented = true
            });

            var param = new UploadAssetsParam
            {
                Files = files,
                TargetCountryCode = WebUtility.HtmlEncode(targetCountryCode),
                LanguageCode = WebUtility.HtmlEncode(languageCode),
                UserId = userId,
                Ip = ip,
                Host = host
            };

            var result = await assetUploaderRepository.UploadAssetsAsync(param);

            if (result.IsFailure)
            {
                await fileService.CleanupUploadedFilesAsync(filePaths);
            }

            return result;
        }
        catch (Exception ex)
        {
            await logger.ErrorAsync(AssetUploaderError.UploadAssetsFailed.Message, ex);
            await fileService.CleanupUploadedFilesAsync(filePaths);
            return Result.Failure(AssetUploaderError.UploadAssetsFailed);
        }
    }

    private async Task<(List<string>, List<ModuleMedia>)> BuildModel(List<ModuleRow>? moduleRows, string targetCountryCode, string languageCode)
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

            var folder = await landingPageService.GetAssetFolder(
                moduleRow.ModuleId,
                targetCountryCode,
                languageCode
            );

            var index = 0;
            var mediaNamesByModule = string.IsNullOrWhiteSpace(moduleRow.InputMediaNames)
                ? null
                : moduleRow.InputMediaNames?.Split("|");
            foreach (var file in moduleRow.Files)
            {
                string dimension;
                await using (var stream = file.OpenReadStream())
                {
                    stream.Position = 0;
                    dimension = imageService.ExtractImageDimensions(stream);
                }

                var fileName = $"{folder}/{file.FileName}";
                var mediaName = file.FileName;
                if (mediaNamesByModule != null)
                {
                    mediaName = mediaNamesByModule[index];
                }

                filePaths.Add(fileName);
                moduleMedia.Files.Add(new MediaItem
                {
                    FileName = WebUtility.HtmlEncode(fileName),
                    MediaName = WebUtility.HtmlEncode(mediaName),
                    Dimension = dimension,
                });

                index++;
            }
            moduleMedias.Add(moduleMedia);
        }

        return (filePaths, moduleMedias);
    }
}
