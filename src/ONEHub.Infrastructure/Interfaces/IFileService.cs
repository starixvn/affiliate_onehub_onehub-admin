using Microsoft.AspNetCore.Http;
using ONEHub.Domain.Common;

namespace ONEHub.Infrastructure.Interfaces;

public interface IFileService
{
    ResultInfo ValidateFile(string fileName, long contentLength, Stream inputStream);
    ResultInfo ValidateAllFiles(IFormFileCollection files);
    ResultInfo ValidateAllInputFileNames(string[] inputFileNames, IFormFileCollection files);
    ResultInfo CheckMultipleFilesInFolder(string[] inputFileNames, string folder);
    ResultInfo CheckDuplicateFileNames(string[] inputFileNames, string nameType = "File");
    ResultInfo ValidateInputFileNameForUpdate(string inputFileName);
    ResultInfo ValidateInputMediaNameForUpdate(string inputMediaName);
    Task UploadFileAsync(IFormFile file, string filePath);
    void DeleteFile(string filePath);
    string[] PrepareInputFileNames(IFormFileCollection files, string inputFileNames);
    ResultInfo ValidateUploadRequest(IFormFileCollection files, string inputFileNames, string? inputMediaNames = null);
    void CleanupUploadedFiles(List<string> filePaths);
}

