namespace ONEHub.Domain.Entities;

public class Campaign
{
    public int CampaignId { get; set; }

    public string CampaignCode { get; set; } = string.Empty;

    public string CampaignName { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Creator { get; set; } = string.Empty;

    public int CreatorId { get; set; }

    public DateTime CreatedDate { get; set; }

    public string UpdatedBy { get; set; } = string.Empty;

    public int UpdatedById { get; set; }

    public DateTime UpdatedDate { get; set; }

    public int StatusId { get; set; }

    public string Status { get; set; } = string.Empty;

    public int RowIdx { get; set; }
}
