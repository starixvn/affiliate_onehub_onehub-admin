using ONEHub.Application.DTOs.Common;
using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.Administrators
{
    public class DeleteDepartmentParamDto : UserInfoParamDto
    {
        [Range(Validation.MinId, Validation.MaxId)]
        public int DepartmentId { get; set; }
    }
}

