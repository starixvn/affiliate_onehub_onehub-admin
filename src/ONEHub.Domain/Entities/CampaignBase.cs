namespace ONEHub.Domain.Entities;

public class CampaignBase
{
    public int CampaignId { get; set; }

    public string CampaignCode { get; set; } = string.Empty;

    public string CampaignName { get; set; } = string.Empty;
}
