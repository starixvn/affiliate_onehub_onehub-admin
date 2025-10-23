namespace ONEHub.Domain.Entities.Campaigns;

public class CampaignDashboard
{
    public int CampaignId { get; set; }
    public string CampaignName { get; set; } = string.Empty;
    public int TotalClicks { get; set; }
    public int TotalSignups { get; set; }
    public int TotalDeposits { get; set; }
    public decimal ConversionRate { get; set; }
}

