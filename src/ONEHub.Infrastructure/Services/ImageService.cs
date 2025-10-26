using Microsoft.Extensions.Logging;
using ONEHub.Domain.Common;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Interfaces;
using SkiaSharp;

namespace ONEHub.Infrastructure.Services;

public class ImageService : IImageService
{
    private readonly ILogger<ImageService> _logger;
    private const string DefaultDimensions = "0x0";

    public ImageService(ILogger<ImageService> logger)
    {
        _logger = logger;
    }

    public string ExtractImageDimensions(Stream inputStream)
    {
        try
        {
            var originalPosition = inputStream.Position;
            inputStream.Position = 0;

            using var codec = SKCodec.Create(inputStream);
            if (codec != null)
            {
                var dimensions = $"{codec.Info.Width}x{codec.Info.Height}";
                inputStream.Position = originalPosition;
                return dimensions;
            }

            inputStream.Position = originalPosition;
            return DefaultDimensions;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to extract image dimensions");
            return DefaultDimensions;
        }
    }

    public ResultInfo ValidateImageDimensions(Stream inputStream, int maxWidth, int maxHeight)
    {
        try
        {
            var originalPosition = inputStream.Position;
            inputStream.Position = 0;

            using var codec = SKCodec.Create(inputStream);
            if (codec != null)
            {
                var width = codec.Info.Width;
                var height = codec.Info.Height;

                inputStream.Position = originalPosition;

                if (width > maxWidth || height > maxHeight)
                {
                    return new ResultInfo
                    {
                        Code = ErrorCodes.GeneralErrorCode,
                        Message = $"Image dimensions ({width}x{height}) exceed maximum allowed size ({maxWidth}x{maxHeight})"
                    };
                }

                return ResultInfo.Success;
            }

            inputStream.Position = originalPosition;
            return ResultInfo.Success;
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "Failed to validate image dimensions");
            return ResultInfo.Success;
        }
    }
}

