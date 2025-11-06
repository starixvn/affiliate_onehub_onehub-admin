using System.Net;
using System.Text.Json;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using ONEHub.Application.Features.Shared;
using ONEHub.Application.Services;
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
    ILogger<UploadAssetsCommandHandler> logger)
    : IRequestHandler<UploadAssetsCommand, Result>
{
    public async Task<Result> Handle(
        UploadAssetsCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var allFiles = new FormFileCollection();
            foreach (var row in request.ModuleRows.Where(row => row.Files.Any()))
            {
                allFiles.AddRange(row.Files);
            }

            var inputFileNames = fileService.PrepareInputFileNames(allFiles, string.Empty);

            var uploadValidation = fileService.ValidateUploadRequest(allFiles, string.Empty);
            if (uploadValidation.IsFailure)
            {
                return Result.Failure(new Error(uploadValidation.ErrorCode, uploadValidation.ErrorMessage));
            }

            var fileNameValidation = fileService.ValidateAllInputFileNames(inputFileNames);
            if (fileNameValidation.IsFailure)
            {
                return Result.Failure(new Error(fileNameValidation.ErrorCode, fileNameValidation.ErrorMessage));
            }

            var languageValidation = await landingPageService.ValidateLanguageByTargetCountry(request.LanguageCode, request.TargetCountryCode);
            if (languageValidation.IsFailure)
            {
                return Result.Failure(new Error(languageValidation.ErrorCode, languageValidation.ErrorMessage));
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
                    return Result.Failure(new Error(folderCheck.ErrorCode, folderCheck.ErrorMessage));
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
            logger.LogError(ex, AssetUploaderError.UploadAssetsFailed.Message);
            return Result.Failure(AssetUploaderError.UploadAssetsFailed);
        }
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
            logger.LogError(ex, AssetUploaderError.UploadAssetsFailed.Message);
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
            foreach (var file in moduleRow.Files)
            {
                string dimension;
                await using (var stream = file.OpenReadStream())
                {
                    stream.Position = 0;
                    dimension = imageService.ExtractImageDimensions(stream);
                }

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
