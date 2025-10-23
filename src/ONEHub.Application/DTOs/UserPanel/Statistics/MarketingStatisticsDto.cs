namespace ONEHub.Application.DTOs.UserPanel.Statistics;

public class MarketingStatisticsDto : ClickStatisticsDto
{
    public string ChannelName { get; set; } = string.Empty;
    public string MarketName { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
}

