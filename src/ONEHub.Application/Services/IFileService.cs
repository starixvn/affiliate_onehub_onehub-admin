using Microsoft.AspNetCore.Http;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Services;

public interface IFileService
{
    Result ValidateFile(string fileName, long contentLength, Stream inputStream);

    Result ValidateAllFiles(IFormFileCollection files);

    Result ValidateAllInputFileNames(string[] inputFileNames, string type = "File");

    Task<Result> CheckMultipleFilesInFolderAsync(string[] inputFileNames, string folder);

    Result CheckDuplicateFileNames(string[] inputFileNames, string nameType = "File");

    Result ValidateInputFileNameForUpdate(string? inputFileName);

    Result ValidateInputMediaNameForUpdate(string? inputMediaName);

    Task UploadFileAsync(IFormFile file, string filePath);

    Task DeleteFileAsync(string filePath);

    string[] PrepareInputFileNames(IFormFileCollection files, string inputFileNames);

    Result ValidateUploadRequest(IFormFileCollection files, string inputFileNames, string? inputMediaNames = null);

    Task CleanupUploadedFilesAsync(List<string> filePaths);
}

