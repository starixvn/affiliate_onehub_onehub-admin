namespace ONEHub.Domain.Entities.Administrators;

public class DepartmentInfo
{
    public int DepartmentId { get; set; }
    public string DepartmentName { get; set; } = string.Empty;
    public int NumberOfUsers { get; set; }
    public string Description { get; set; } = string.Empty;
}

