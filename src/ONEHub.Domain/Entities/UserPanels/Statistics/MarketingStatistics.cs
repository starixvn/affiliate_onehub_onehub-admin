namespace ONEHub.Domain.Entities.UserPanels.Statistics;

public class MarketingStatistics : ClickStatistics
{
    public string ChannelName { get; set; } = string.Empty;
    public string MarketName { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
}

