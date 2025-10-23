namespace ONEHub.Application.DTOs.LandingPages;

public class MediaSourceInfoDto
{
    public int MediaId { get; set; }
    public string MediaUrl { get; set; } = string.Empty;
    public string MediaName { get; set; } = string.Empty;
    public int ModuleId { get; set; }
}

