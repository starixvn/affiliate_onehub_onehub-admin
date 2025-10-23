using ONEHub.Application.DTOs.Common;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.Messages
{
    public class InsertUpdateMessageParamDto : UserInfoParamDto
    {
        public int MessageId { get; set; }
        public bool Important { get; set; }

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Message_en { get; set; } = string.Empty;

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Message_cs { get; set; } = string.Empty;

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Message_th { get; set; } = string.Empty;

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Message_vn { get; set; } = string.Empty;

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Message_id { get; set; } = string.Empty;

        [DisplayFormat(ConvertEmptyStringToNull = false)]
        public string Message_ko { get; set; } = string.Empty;

        public bool IsValid()
        {
            if (!(string.IsNullOrEmpty(Message_en) && string.IsNullOrEmpty(Message_cs) && string.IsNullOrEmpty(Message_ko)))
            {
                return true;
            }

            return !(string.IsNullOrEmpty(Message_th) && string.IsNullOrEmpty(Message_vn) && string.IsNullOrEmpty(Message_id));
        }
    }
}

