using System.ComponentModel.DataAnnotations;

namespace ONEHub.Domain.DTOs.LandingPages;

public class UploadAssetsRequest
{
    [Required]
    public int ModuleId { get; set; }

    [Required]
    public string TargetCountryCode { get; set; } = string.Empty;

    [Required]
    public string LanguageCode { get; set; } = string.Empty;

    public string InputFileNames { get; set; } = string.Empty;
    public string InputMediaNames { get; set; } = string.Empty;
}

