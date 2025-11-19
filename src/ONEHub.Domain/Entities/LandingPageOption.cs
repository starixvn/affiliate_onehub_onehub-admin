namespace ONEHub.Domain.Entities;

public class LandingPageOption
{
    public string PageCode { get; set; } = string.Empty;

    public string PageName { get; set; } = string.Empty;

    public string Category { get; set; } = string.Empty;

    public int PageType { get; set; }

    public string TargetCountryCode { get; set; } = string.Empty;

    public string MarketId { get; set; } = string.Empty;

    public int CampaignId { get; set; }

    public string CampaignCode { get; set; } = string.Empty;
}

