using Microsoft.Extensions.Logging;
using ONEHub.Application.Services;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Results;
using SixLabors.ImageSharp;

namespace ONEHub.Infrastructure.Services;
public class ImageService(ILogger<ImageService> logger) : IImageService
{
    private const string DEFAULT_DIMENSIONS = "0x0";

    public string ExtractImageDimensions(Stream inputStream)
    {
        try
        {
            var originalPosition = inputStream.CanSeek ? inputStream.Position : 0;
            inputStream.Position = 0;

            var info = Image.Identify(inputStream);
            if (inputStream.CanSeek)
            {
                inputStream.Position = originalPosition;
            }

            return $"{info.Width}x{info.Height}";
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to extract image dimensions");
            return DEFAULT_DIMENSIONS;
        }
    }


    public Result ValidateImageDimensions(Stream inputStream, int maxWidth, int maxHeight)
    {
        try
        {
            var originalPosition = inputStream.CanSeek ? inputStream.Position : 0;
            inputStream.Position = 0;

            var info = Image.Identify(inputStream);
            if (inputStream.CanSeek)
            {
                inputStream.Position = originalPosition;
            }

            var width = info.Width;
            var height = info.Height;

            if (width > maxWidth || height > maxHeight)
            {
                return Result.Failure(Error.SystemError with
                {
                    Message = $"Image dimensions ({width}x{height}) exceed maximum allowed size ({maxWidth}x{maxHeight})"
                });
            }

            return Result.Success();
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to validate image dimensions");
            return Result.Success();
        }
    }
}
