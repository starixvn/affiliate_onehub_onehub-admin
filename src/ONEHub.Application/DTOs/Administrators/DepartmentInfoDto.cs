namespace ONEHub.Application.DTOs.Administrators
{
    public class DepartmentInfoDto
    {
        public int DepartmentId { get; set; }
        public string DepartmentName { get; set; } = string.Empty;
        public int NoOfUser { get; set; }
        public string Description { get; set; } = string.Empty;
    }
}

