namespace ONEHub.Application.DTOs.Common;

public class TargetCountryDto
{
    public string TargetCountryCode { get; set; } = string.Empty;
    public string TargetCountryName { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
    public string LanguageName { get; set; } = string.Empty;
    public byte Status { get; set; }
}

