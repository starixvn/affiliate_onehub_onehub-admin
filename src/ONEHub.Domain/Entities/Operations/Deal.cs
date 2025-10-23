using ONEHub.Domain.Common;

namespace ONEHub.Domain.Entities.Operations;

public class Deal : BaseEntity
{
    public int GroupId { get; set; }
    public string GroupName { get; set; } = string.Empty;
    public DealType DealType { get; set; }
    public bool IsActive { get; set; }
    public bool IsDefault { get; set; }
}

