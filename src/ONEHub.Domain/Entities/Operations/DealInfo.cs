using ONEHub.Domain.Common;

namespace ONEHub.Domain.Entities.Operations;

public class DealInfo : BaseEntity, IAuditableEntity
{
    public int RowNumber { get; set; }
    public int GroupId { get; set; }
    public string DealName { get; set; } = string.Empty;
    public string DealType { get; set; } = string.Empty;
    public int NumberOfAffiliates { get; set; }
    public string Description { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;
    public DateTime? UpdatedDate { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string ModifiedBy { get; set; } = string.Empty;
}

