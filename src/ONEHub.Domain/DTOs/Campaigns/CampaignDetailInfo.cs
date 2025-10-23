namespace ONEHub.Domain.DTOs.Campaigns;

public class CampaignDetailInfo : CampaignInfo
{
    public string Description { get; set; } = string.Empty;
    public string Creator { get; set; } = string.Empty;
    public int CreatorId { get; set; }
    public DateTime CreatedDate { get; set; }
    public string CreatedDateText => CreatedDate.ToString("MM/dd/yyyy");
    public string UpdatedBy { get; set; } = string.Empty;
    public int UpdatedById { get; set; }
    public DateTime UpdatedDate { get; set; }
    public string UpdatedDateText => UpdatedDate.ToString("MM/dd/yyyy");
    public int StatusId { get; set; }
    public string Status { get; set; } = string.Empty;
    public int RowIdx { get; set; }
}

