namespace ONEHub.Application.DTOs.UserPanel.Statistics;

public class ClickStatisticsDto
{
    public int TotalClick { get; set; }
    public int UniqueClick { get; set; }
    public int Signups { get; set; }
    public int Fdm { get; set; }
    public string WebsiteUrl { get; set; } = string.Empty;
}

