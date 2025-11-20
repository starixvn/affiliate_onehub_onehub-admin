using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;
using Fanex.Logging;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using ONEHub.Application.Services;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Results;

namespace ONEHub.Infrastructure.Services;

public class S3FileService : IFileService
{
    private const int MAX_LENGTH = 200;
    private const string RESTRICTED_MULTI_INPUT_FILE_NAMES_PATTERN = "[\\\\/:*?\"<>#%&+]";
    private const string DUPLICATE_FILE_NAME_MESSAGE = "{0} Name is unique, please enter other {0} name!";
    private const string EXISTED_FILE_NAMES_MESSAGE = "File name(s) already exists: {0}. Please rename or remove the file(s) before uploading.";
    private const string INVALID_FILE_TYPE_MESSAGE = "Invalid file type. Only image files are allowed (.jpg, .jpeg, .png, .gif, .webp).";
    private const string FILE_SIZE_EXCEEDED_MESSAGE = "File size exceeds maximum limit of {0}MB.";
    private const string FILE_NAME_CAN_NOT_CONTAIN = "File name cannot contain special characters: \\ / : * ? \" < > # % & +";
    private const string MAX_LENGTH_FILE_NAME_MESSAGE = "The maximum length of file name is 200.";

    private readonly IConfiguration _configuration;
    private readonly IStorageService _storageService;
    private readonly IImageService _imageService;
    private readonly ILogger _logger;

    private readonly string[] _allowedExtensions;
    private readonly long _maxFileSizeBytes;
    private readonly int _maxImageWidth;
    private readonly int _maxImageHeight;

    public S3FileService(
        IConfiguration configuration,
        IStorageService storageService,
        IImageService imageService,
        ILogger logger)
    {
        _configuration = configuration;
        _storageService = storageService;
        _imageService = imageService;
        _logger = logger;

        _allowedExtensions = _configuration["AppSettings:AllowedImageExtensions"]!.Split(',');

        var maxFileSizeMb = int.Parse(_configuration["AppSettings:MaxFileSize"]!, CultureInfo.InvariantCulture);
        _maxFileSizeBytes = maxFileSizeMb * 1024 * 1024;

        _maxImageWidth = int.Parse(_configuration["AppSettings:MaxImageWidth"]!, CultureInfo.InvariantCulture);
        _maxImageHeight = int.Parse(_configuration["AppSettings:MaxImageHeight"]!, CultureInfo.InvariantCulture);
    }

    public Result ValidateFile(string fileName, long contentLength, Stream inputStream)
    {
        if (contentLength > _maxFileSizeBytes)
        {
            return Result.Failure(Error.SystemError with
            {
                Message = string.Format(FILE_SIZE_EXCEEDED_MESSAGE, _maxFileSizeBytes / (1024 * 1024))
            });
        }

        var extension = Path.GetExtension(fileName).ToLowerInvariant();
        if (!_allowedExtensions.Contains(extension))
        {
            return Result.Failure(Error.SystemError with
            {
                Message = INVALID_FILE_TYPE_MESSAGE
            });
        }

        var validationResult = _imageService.ValidateImageDimensions(inputStream, _maxImageWidth, _maxImageHeight);
        if (!validationResult.IsSuccess)
        {
            return validationResult;
        }

        return Result.Success();
    }

    public Result ValidateAllFiles(IFormFileCollection files)
    {
        if (files.Count == 0)
        {
            return Result.Failure(Error.SystemError with
            {
                Message = "No files provided"
            });
        }

        var maxFiles = int.Parse(_configuration["AppSettings:MaximumFiles"] ?? "50", CultureInfo.InvariantCulture);
        if (files.Count > maxFiles)
        {
            return Result.Failure(Error.SystemError with
            {
                Message = $"Maximum {maxFiles} files allowed"
            });
        }

        var message = new StringBuilder();

        foreach (var file in files)
        {
            if (file.Length == 0)
            {
                message.AppendLine($"File {file.FileName} is empty. <br />");
                continue;
            }

            using var stream = file.OpenReadStream();
            var validationResult = ValidateFile(file.FileName, file.Length, stream);

            if (!validationResult.IsSuccess)
            {
                message.AppendLine($"File {file.FileName} is incorrect. {validationResult.ErrorMessage} <br />");
            }
        }

        if (!string.IsNullOrWhiteSpace(message.ToString()))
        {
            return Result.Failure(Error.SystemError with
            {
                Message = message.ToString()
            });
        }

        return Result.Success();
    }

    public Result ValidateAllInputFileNames(string[] inputFileNames, string type = "File")
    {
        var result = CheckDuplicateFileNames(inputFileNames, type);
        if (result.IsFailure)
        {
            return result;
        }

        var message = new StringBuilder();
        for (var i = 0; i < inputFileNames.Length; i++)
        {
            _ = ValidateProvidedInputFileName(inputFileNames[i], i, message, type);
        }

        if (!string.IsNullOrWhiteSpace(message.ToString()))
        {
            return Result.Failure(Error.SystemError with
            {
                Message = message.ToString()
            });
        }

        return Result.Success();
    }

    private Result ValidateProvidedInputFileName(string inputFileName, int index, StringBuilder message, string type)
    {

        if (string.IsNullOrEmpty(inputFileName))
        {
            return Result.Success();
        }

        if (Regex.IsMatch(inputFileName, RESTRICTED_MULTI_INPUT_FILE_NAMES_PATTERN, RegexOptions.None, TimeSpan.FromMilliseconds(100)))
        {
            message.Append($"{type} Name {index + 1} cannot contain special characters: \\ / : * ? \" < > # % & +<br />");
        }

        var extension = Path.GetExtension(inputFileName).ToLowerInvariant();
        if (type == "File" && !_allowedExtensions.Contains(extension))
        {
            message.Append($"{type} Name {index + 1} has invalid file type. Only image files are allowed.<br />");
        }

        if (inputFileName.Length > MAX_LENGTH)
        {
            message.Append($"{type} Name {index + 1} exceeds maximum length of 200 characters.<br />");
        }

        if (!string.IsNullOrWhiteSpace(message.ToString()))
        {
            return Result.Failure(Error.SystemError with
            {
                Message = message.ToString()
            });
        }

        return Result.Success();
    }

    public async Task<Result> CheckMultipleFilesInFolderAsync(string[] inputFileNames, string folder)
    {
        var existingFiles = new List<string>();

        foreach (var fileName in inputFileNames)
        {
            var key = string.IsNullOrEmpty(folder) ? fileName : $"{folder}/{fileName}";

            if (await _storageService.FileExistsAsync(key))
            {
                existingFiles.Add(fileName);
            }
        }

        if (existingFiles.Any())
        {
            return Result.Failure(Error.SystemError with
            {
                Message = string.Format(EXISTED_FILE_NAMES_MESSAGE, string.Join(", ", existingFiles))
            });
        }

        return Result.Success();
    }

    public Result CheckDuplicateFileNames(string[] inputFileNames, string nameType = "File")
    {
        var length = inputFileNames.Length;
        for (var i = 0; i <= length - 1; i++)
        {
            var fileName = inputFileNames[i].Trim();

            for (var j = i + 1; j < length; j++)
            {
                if (string.Equals(fileName, inputFileNames[j].Trim(), StringComparison.OrdinalIgnoreCase))
                {
                    return Result.Failure(Error.SystemError with
                    {
                        Message = string.Format(DUPLICATE_FILE_NAME_MESSAGE, nameType)
                    });
                }
            }
        }

        return Result.Success();
    }

    public Result ValidateInputFileNameForUpdate(string? inputFileName)
    {
        if (string.IsNullOrEmpty(inputFileName))
        {
            return Result.Success();
        }

        if (Regex.IsMatch(inputFileName, RESTRICTED_MULTI_INPUT_FILE_NAMES_PATTERN, RegexOptions.None, TimeSpan.FromMilliseconds(100)))
        {
            return Result.Failure(Error.SystemError with
            {
                Message = FILE_NAME_CAN_NOT_CONTAIN
            });
        }

        var extension = Path.GetExtension(inputFileName).ToLowerInvariant();
        if (!_allowedExtensions.Contains(extension))
        {
            return Result.Failure(Error.SystemError with
            {
                Message = INVALID_FILE_TYPE_MESSAGE
            });
        }

        if (inputFileName.Length > MAX_LENGTH)
        {
            return Result.Failure(Error.SystemError with
            {
                Message = MAX_LENGTH_FILE_NAME_MESSAGE
            });
        }

        return Result.Success();
    }

    public Result ValidateInputMediaNameForUpdate(string? inputMediaName)
    {
        if (string.IsNullOrEmpty(inputMediaName))
        {
            return Result.Success();
        }

        if (Regex.IsMatch(inputMediaName, RESTRICTED_MULTI_INPUT_FILE_NAMES_PATTERN, RegexOptions.None, TimeSpan.FromMilliseconds(100)))
        {
            return Result.Failure(Error.SystemError with
            {
                Message = FILE_NAME_CAN_NOT_CONTAIN
            });
        }

        if (inputMediaName.Length > MAX_LENGTH)
        {
            return Result.Failure(Error.SystemError with
            {
                Message = "The maximum length of media name is 200."
            });
        }

        return Result.Success();
    }

    public async Task UploadFileAsync(IFormFile file, string filePath)
    {
        var success = await _storageService.UploadFileAsync(file, filePath);
        if (!success)
        {
            await _logger.CriticalAsync($"Failed to upload file to S3: {filePath}");
        }
    }

    public async Task DeleteFileAsync(string filePath)
    {
        var success = await _storageService.DeleteFileAsync(filePath);
        if (!success)
        {
            await _logger.CriticalAsync($"Failed to upload file to S3: {filePath}");
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

    public Result ValidateUploadRequest(IFormFileCollection files, string inputFileNames, string? inputMediaNames = null)
    {
        var result = ValidateAllFiles(files);
        if (!result.IsSuccess)
        {
            return result;
        }

        if (!string.IsNullOrEmpty(inputFileNames) && Regex.IsMatch(inputFileNames, RESTRICTED_MULTI_INPUT_FILE_NAMES_PATTERN, RegexOptions.None, TimeSpan.FromMilliseconds(100)))
        {
            return Result.Failure(Error.SystemError with
            {
                Message = FILE_NAME_CAN_NOT_CONTAIN
            });
        }

        if (!string.IsNullOrEmpty(inputMediaNames) && Regex.IsMatch(inputMediaNames, RESTRICTED_MULTI_INPUT_FILE_NAMES_PATTERN, RegexOptions.None, TimeSpan.FromMilliseconds(100)))
        {
            return Result.Failure(Error.SystemError with
            {
                Message = "Media name cannot contain special characters"
            });
        }

        return Result.Success();
    }

    public async Task CleanupUploadedFilesAsync(List<string> filePaths)
    {
        foreach (var key in filePaths)
        {
            await DeleteFileAsync(key);
        }
    }
}
