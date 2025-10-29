using ONEHub.Application.DTOs.Common;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.Administrators
{
    public class UpdatePolicyParamDto : UserInfoParamDto
    {
        [Required]
        public string GroupPolicies { get; set; } = string.Empty;
    }
}
