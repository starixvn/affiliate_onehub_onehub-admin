namespace ONEHub.Domain.Entities.UserPanels.Statistics;

public class LandingPageStatistics : ClickStatistics
{
    public string Page { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
}

