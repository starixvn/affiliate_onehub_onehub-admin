namespace ONEHub.Application.DTOs.LandingPages;

public class MediaSourceParamDto
{
    public int ModuleId { get; set; }
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
}

