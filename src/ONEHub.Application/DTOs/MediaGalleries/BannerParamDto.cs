using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.MediaGalleries;

public class BannerParamDto
{
    public string Category { get; set; } = string.Empty;
    public string SubCategory { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public byte AffType { get; set; }
    public string DeviceType { get; set; } = string.Empty;
    public byte UserType { get; set; }
    public string Size { get; set; } = string.Empty;

    [Range(Validation.MinPageIndex, Validation.MaxPageIndex)]
    public int PageIndex { get; set; }

    [Range(Validation.MinPageSize, Validation.MaxPageSize)]
    public int PageSize { get; set; }
}

