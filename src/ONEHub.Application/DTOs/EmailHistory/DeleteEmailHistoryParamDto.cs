using ONEHub.Application.DTOs.Common;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.EmailHistory
{
    public class DeleteEmailHistoryParamDto : UserInfoParamDto
    {
        [Required(ErrorMessage = "Please select emails to delete")]
        public string EmailIdList { get; set; } = string.Empty;
    }
}

