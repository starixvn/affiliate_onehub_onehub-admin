using ONEHub.Domain.Common;

namespace ONEHub.Domain.Interfaces;

public interface IImageService
{
    string ExtractImageDimensions(Stream inputStream);
    ResultInfo ValidateImageDimensions(Stream inputStream, int maxWidth, int maxHeight);
}

