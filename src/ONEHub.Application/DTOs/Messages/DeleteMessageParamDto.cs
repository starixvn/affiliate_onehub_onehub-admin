using ONEHub.Application.DTOs.Common;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.Messages
{
    public class DeleteMessageParamDto : UserInfoParamDto
    {
        [Required(ErrorMessage = "Please select messages to delete")]
        public string MessageIdList { get; set; } = string.Empty;
    }
}

