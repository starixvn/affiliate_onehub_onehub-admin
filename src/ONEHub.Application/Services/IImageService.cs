using ONEHub.Domain.Results;

namespace ONEHub.Application.Services;

public interface IImageService
{
    string ExtractImageDimensions(Stream inputStream);

    Result ValidateImageDimensions(Stream inputStream, int maxWidth, int maxHeight);
}
