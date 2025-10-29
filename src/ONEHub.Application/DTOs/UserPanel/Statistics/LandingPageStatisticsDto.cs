namespace ONEHub.Application.DTOs.UserPanel.Statistics;

public class LandingPageStatisticsDto : ClickStatisticsDto
{
    public string Page { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
}

