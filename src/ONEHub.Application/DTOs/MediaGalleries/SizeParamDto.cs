namespace ONEHub.Application.DTOs.MediaGalleries;

public class SizeParamDto
{
    public string Category { get; set; } = string.Empty;
    public string SubCategory { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public byte AffType { get; set; }
    public string DeviceType { get; set; } = string.Empty;
    public byte UserType { get; set; }
    public string ImageType { get; set; } = string.Empty;
}

