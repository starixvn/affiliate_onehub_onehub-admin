using ONEHub.Domain.Common;

namespace ONEHub.Domain.Entities.Campaigns;

public class CampaignDetailInfo : CampaignInfo, IAuditableEntity
{
    public string Description { get; set; } = string.Empty;
    public string Creator { get; set; } = string.Empty;
    public int CreatorId { get; set; }
    public DateTime CreatedDate { get; set; }
    public string UpdatedBy { get; set; } = string.Empty;
    public int UpdatedById { get; set; }
    public DateTime UpdatedDate { get; set; }
    public int StatusId { get; set; }
    public string Status { get; set; } = string.Empty;
    public int RowIndex { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string ModifiedBy { get; set; } = string.Empty;
    DateTime? IAuditableEntity.ModifiedDate { get => UpdatedDate; set => UpdatedDate = value ?? DateTime.UtcNow; }
}
