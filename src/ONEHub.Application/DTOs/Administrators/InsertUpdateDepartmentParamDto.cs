using ONEHub.Application.DTOs.Common;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.Administrators
{
    public class InsertUpdateDepartmentParamDto : UserInfoParamDto
    {
        public int DepartmentId { get; set; }

        [Required]
        public string DepartmentName { get; set; } = string.Empty;

        public string Description { get; set; } = string.Empty;
    }
}

