using ONEHub.Domain.Common;

namespace ONEHub.Domain.Entities.Administrators;

public class Department : BaseEntity
{
    public string DepartmentName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

