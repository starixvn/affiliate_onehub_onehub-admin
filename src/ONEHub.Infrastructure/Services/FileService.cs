using System.Text;
using System.Text.RegularExpressions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Common;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Infrastructure.Services;

public class FileService : IFileService
{
    private const int MaxLength = 200;
    private const string RestrictedMultiInputFileNamesPattern = "[\\\\/:*?\"<>#%&+]";
    private const string DuplicateFileNameMessage = "{0} Name is unique, please enter other {0} name!";
    private const string ExistedFileNamesMessage = "File name(s) already exists: {0}. Please rename or remove the file(s) before uploading.";
    private const string InvalidFileTypeMessage = "Invalid file type. Only image files are allowed (.jpg, .jpeg, .png, .gif, .webp).";
    private const string FileSizeExceededMessage = "File size exceeds maximum limit of {0}MB.";
    private const string FileNameCanNotContain = "File name cannot contain special characters: \\ / : * ? \" < > # % & +";
    private const string MaxLengthFileNameMessage = "The maximum length of file name is 200.";

    private readonly IConfiguration _configuration;
    private readonly ISystemFile _systemFile;
    private readonly IImageService _imageService;
    private readonly ILogger<FileService> _logger;

    private readonly string[] _allowedExtensions;
    private readonly long _maxFileSizeBytes;
    private readonly int _maxImageWidth;
    private readonly int _maxImageHeight;
    private readonly string[] _bannerFolders;

    public FileService(
        IConfiguration configuration,
        ISystemFile systemFile,
        IImageService imageService,
        ILogger<FileService> logger)
    {
        _configuration = configuration;
        _systemFile = systemFile;
        _imageService = imageService;
        _logger = logger;

        _allowedExtensions = (_configuration["AppSettings:AllowedImageExtensions"] ?? ".jpg,.jpeg,.png,.gif,.webp")
            .Split(',')
            .Select(e => e.Trim())
            .ToArray();

        var maxFileSizeMB = int.Parse(_configuration["AppSettings:MaxFileSize"] ?? "3");
        _maxFileSizeBytes = maxFileSizeMB * 1024 * 1024;

        _maxImageWidth = int.Parse(_configuration["AppSettings:MaxImageWidth"] ?? "2000");
        _maxImageHeight = int.Parse(_configuration["AppSettings:MaxImageHeight"] ?? "2000");

        _bannerFolders = (_configuration["AppSettings:BannerFolders"] ?? "D:\\Assets\\Banner")
            .Split(';')
            .Select(f => f.Trim())
            .ToArray();
    }

    public ResultInfo ValidateFile(string fileName, long contentLength, Stream inputStream)
    {
        if (contentLength > _maxFileSizeBytes)
        {
            return new ResultInfo
            {
                Code = ErrorCodes.GeneralErrorCode,
                Message = string.Format(FileSizeExceededMessage, _maxFileSizeBytes / (1024 * 1024))
            };
        }

        var extension = _systemFile.GetExtension(fileName).ToLower();
        if (!_allowedExtensions.Contains(extension))
        {
            return new ResultInfo
            {
                Code = ErrorCodes.GeneralErrorCode,
                Message = InvalidFileTypeMessage
            };
        }

        var validationResult = _imageService.ValidateImageDimensions(inputStream, _maxImageWidth, _maxImageHeight);
        if (!validationResult.IsSuccessful)
        {
            return validationResult;
        }

        return ResultInfo.Success;
    }

    public ResultInfo ValidateAllFiles(IFormFileCollection files)
    {
        if (files == null || files.Count == 0)
        {
            return new ResultInfo
            {
                Code = ErrorCodes.GeneralErrorCode,
                Message = "No files provided"
            };
        }

        var maxFiles = int.Parse(_configuration["AppSettings:MaximumFiles"] ?? "50");
        if (files.Count > maxFiles)
        {
            return new ResultInfo
            {
                Code = ErrorCodes.GeneralErrorCode,
                Message = $"Maximum {maxFiles} files allowed"
            };
        }

        var result = new ResultInfo();
        var message = new StringBuilder();

        foreach (var file in files)
        {
            if (file.Length == 0)
            {
                result.Code = ErrorCodes.GeneralErrorCode;
                message.AppendLine($"File {file.FileName} is empty.");
                continue;
            }

            using var stream = file.OpenReadStream();
            var validationResult = ValidateFile(file.FileName, file.Length, stream);

            if (!validationResult.IsSuccessful)
            {
                result.Code = validationResult.Code;
                message.AppendLine($"File {file.FileName} is incorrect. {validationResult.Message}");
            }
        }

        result.Message = message.ToString();
        return result;
    }

    public ResultInfo ValidateAllInputFileNames(string[] inputFileNames, IFormFileCollection files)
    {
        var result = CheckDuplicateFileNames(inputFileNames);
        if (!result.IsSuccessful)
        {
            return result;
        }

        var message = new StringBuilder();
        for (int i = 0; i < inputFileNames.Length; i++)
        {
            var validationResult = ValidateProvidedInputFileName(inputFileNames[i], i, message);
            if (!validationResult.IsSuccessful)
            {
                result.Code = validationResult.Code;
            }
        }

        result.Message = message.ToString();
        return result;
    }

    public ResultInfo ValidateProvidedInputFileName(string inputFileName, int index, StringBuilder message)
    {
        var result = new ResultInfo();

        if (string.IsNullOrEmpty(inputFileName))
        {
            return result;
        }

        if (Regex.IsMatch(inputFileName, RestrictedMultiInputFileNamesPattern))
        {
            result.Code = ErrorCodes.GeneralErrorCode;
            message.Append($"File Name {index + 1} cannot contain special characters: \\ / : * ? \" < > # % & +<br />");
        }

        var extension = _systemFile.GetExtension(inputFileName).ToLower();
        if (!_allowedExtensions.Contains(extension))
        {
            result.Code = ErrorCodes.GeneralErrorCode;
            message.Append($"File Name {index + 1} has invalid file type. Only image files are allowed.<br />");
        }

        if (inputFileName.Length > MaxLength)
        {
            result.Code = ErrorCodes.GeneralErrorCode;
            message.Append($"File Name {index + 1} exceeds maximum length of 200 characters.<br />");
        }

        return result;
    }

    public ResultInfo CheckMultipleFilesInFolder(string[] inputFileNames, string folder)
    {
        var existingFiles = new List<string>();

        foreach (var fileName in inputFileNames)
        {
            var filePath = $"{folder}/{fileName}";
            foreach (var serverPath in _bannerFolders)
            {
                var fullPath = Path.Combine(serverPath, filePath);
                if (_systemFile.FileExists(fullPath))
                {
                    existingFiles.Add(fileName);
                    break;
                }
            }
        }

        if (existingFiles.Any())
        {
            return new ResultInfo
            {
                Code = ErrorCodes.ErrTheFileNameAlreadyExists,
                Message = string.Format(ExistedFileNamesMessage, string.Join(", ", existingFiles))
            };
        }

        return ResultInfo.Success;
    }

    public ResultInfo CheckDuplicateFileNames(string[] inputFileNames, string nameType = "File")
    {
        var length = inputFileNames.Length;
        for (var i = 0; i <= length - 1; i++)
        {
            var fileName = inputFileNames[i].Trim();

            for (var j = i + 1; j < length; j++)
            {
                if (string.Equals(fileName, inputFileNames[j].Trim(), StringComparison.OrdinalIgnoreCase))
                {
                    return new ResultInfo
                    {
                        Code = ErrorCodes.GeneralErrorCode,
                        Message = string.Format(DuplicateFileNameMessage, nameType)
                    };
                }
            }
        }

        return ResultInfo.Success;
    }

    public ResultInfo ValidateInputFileNameForUpdate(string inputFileName)
    {
        if (string.IsNullOrEmpty(inputFileName))
        {
            return ResultInfo.Success;
        }

        if (Regex.IsMatch(inputFileName, RestrictedMultiInputFileNamesPattern))
        {
            return new ResultInfo
            {
                Code = ErrorCodes.GeneralErrorCode,
                Message = FileNameCanNotContain
            };
        }

        var extension = Path.GetExtension(inputFileName).ToLower();
        var allowedExtensions = _configuration["AppSettings:AllowedImageExtensions"]?
            .Split(',')
            .Select(e => e.Trim().ToLower())
            .ToArray() ?? new[] { ".jpg", ".jpeg", ".png", ".gif", ".webp" };

        if (!allowedExtensions.Contains(extension))
        {
            return new ResultInfo
            {
                Code = ErrorCodes.GeneralErrorCode,
                Message = InvalidFileTypeMessage
            };
        }

        if (inputFileName.Length > MaxLength)
        {
            return new ResultInfo
            {
                Code = ErrorCodes.GeneralErrorCode,
                Message = MaxLengthFileNameMessage
            };
        }

        return ResultInfo.Success;
    }

    public ResultInfo ValidateInputMediaNameForUpdate(string inputMediaName)
    {
        if (string.IsNullOrEmpty(inputMediaName))
        {
            return ResultInfo.Success;
        }

        if (Regex.IsMatch(inputMediaName, RestrictedMultiInputFileNamesPattern))
        {
            return new ResultInfo
            {
                Code = ErrorCodes.GeneralErrorCode,
                Message = FileNameCanNotContain
            };
        }

        if (inputMediaName.Length > MaxLength)
        {
            return new ResultInfo
            {
                Code = ErrorCodes.GeneralErrorCode,
                Message = "The maximum length of media name is 200."
            };
        }

        return ResultInfo.Success;
    }

    public async Task UploadFileAsync(IFormFile file, string filePath)
    {
        foreach (var serverPath in _bannerFolders)
        {
            var fullPath = Path.Combine(serverPath, filePath);
            var directory = Path.GetDirectoryName(fullPath);

            if (!string.IsNullOrEmpty(directory))
            {
                _systemFile.CreateDirectory(directory);
            }

            using var stream = new FileStream(fullPath, FileMode.Create, FileAccess.Write);
            await file.CopyToAsync(stream);
        }
    }

    public void DeleteFile(string filePath)
    {
        foreach (var serverPath in _bannerFolders)
        {
            var fullPath = Path.Combine(serverPath, filePath);
            _systemFile.DeleteFile(fullPath);
        }
    }

    public string[] PrepareInputFileNames(IFormFileCollection files, string inputFileNames)
    {
        if (string.IsNullOrEmpty(inputFileNames))
        {
            return files.Select(f => f.FileName).ToArray();
        }

        return inputFileNames.Split('|');
    }

    public ResultInfo ValidateUploadRequest(IFormFileCollection files, string inputFileNames, string? inputMediaNames = null)
    {
        var result = ValidateAllFiles(files);
        if (!result.IsSuccessful)
        {
            return result;
        }

        if (!string.IsNullOrEmpty(inputFileNames) && Regex.IsMatch(inputFileNames, RestrictedMultiInputFileNamesPattern))
        {
            return new ResultInfo
            {
                Code = ErrorCodes.GeneralErrorCode,
                Message = FileNameCanNotContain
            };
        }

        if (!string.IsNullOrEmpty(inputMediaNames) && Regex.IsMatch(inputMediaNames, RestrictedMultiInputFileNamesPattern))
        {
            return new ResultInfo
            {
                Code = ErrorCodes.GeneralErrorCode,
                Message = "Media name cannot contain special characters"
            };
        }

        return ResultInfo.Success;
    }

    public void CleanupUploadedFiles(List<string> filePaths)
    {
        foreach (var filePath in filePaths)
        {
            try
            {
                DeleteFile(filePath);
            }
            catch (Exception ex)
            {
                _logger.LogWarning(ex, "Failed to cleanup file: {FilePath}", filePath);
            }
        }
    }
}
