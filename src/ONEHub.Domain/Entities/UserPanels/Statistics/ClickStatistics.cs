namespace ONEHub.Domain.Entities.UserPanels.Statistics;

public class ClickStatistics
{
    public int TotalClick { get; set; }
    public int UniqueClick { get; set; }
    public int Signups { get; set; }
    public int FirstTimeDeposits { get; set; }
    public string WebsiteUrl { get; set; } = string.Empty;
}

