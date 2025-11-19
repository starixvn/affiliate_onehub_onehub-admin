using Microsoft.Extensions.Logging;
using ONEHub.Application.Services;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Results;
using SkiaSharp;

namespace ONEHub.Infrastructure.Services;
public class ImageService(ILogger<ImageService> logger) : IImageService
{
    private const string DEFAULT_DIMENSIONS = "0x0";

    public string ExtractImageDimensions(Stream inputStream)
    {
        try
        {
            var originalPosition = inputStream.Position;
            inputStream.Position = 0;

            using (var codec = SKCodec.Create(inputStream))
            {
                if (codec != null)
                {
                    var dimensions = $"{codec.Info.Width}x{codec.Info.Height}";
                    inputStream.Position = originalPosition;
                    return dimensions;
                }
            }

            inputStream.Position = originalPosition;
            return DEFAULT_DIMENSIONS;
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
            var originalPosition = inputStream.Position;
            inputStream.Position = 0;

            using (var codec = SKCodec.Create(inputStream))
            {
                if (codec != null)
                {
                    var width = codec.Info.Width;
                    var height = codec.Info.Height;

                    inputStream.Position = originalPosition;

                    if (width > maxWidth || height > maxHeight)
                    {
                        return Result.Failure(Error.SystemError with
                        {
                            Message = $"Image dimensions ({width}x{height}) exceed maximum allowed size ({maxWidth}x{maxHeight})"
                        });
                    }

                    return Result.Success();
                }
            }

            inputStream.Position = originalPosition;
            return Result.Success();
        }
        catch (Exception ex)
        {
            logger.LogWarning(ex, "Failed to validate image dimensions");
            return Result.Success();
        }
    }
}
