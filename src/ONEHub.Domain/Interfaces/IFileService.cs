using Microsoft.AspNetCore.Http;
using ONEHub.Domain.Common;

namespace ONEHub.Domain.Interfaces;

public interface IFileService
{
    ResultInfo ValidateFile(string fileName, long contentLength, Stream inputStream);

    ResultInfo ValidateAllFiles(IFormFileCollection files);

    ResultInfo ValidateAllInputFileNames(string[] inputFileNames);

    Task<ResultInfo> CheckMultipleFilesInFolderAsync(string[] inputFileNames, string folder);

    ResultInfo CheckDuplicateFileNames(string[] inputFileNames, string nameType = "File");

    ResultInfo ValidateInputFileNameForUpdate(string inputFileName);

    ResultInfo ValidateInputMediaNameForUpdate(string inputMediaName);

    Task UploadFileAsync(IFormFile file, string filePath);

    Task DeleteFileAsync(string filePath);

    string[] PrepareInputFileNames(IFormFileCollection files, string inputFileNames);

    ResultInfo ValidateUploadRequest(IFormFileCollection files, string inputFileNames, string? inputMediaNames = null);

    Task CleanupUploadedFilesAsync(List<string> filePaths);
}

