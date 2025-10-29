namespace ONEHub.Application.DTOs.Messages
{
    public class MessageInfoDto
    {
        public int MessageId { get; set; }
        public string Creator { get; set; } = string.Empty;
        public string Message_en { get; set; } = string.Empty;
        public string Message => Message_en;
        public bool Important { get; set; }
        public string UpdatedBy { get; set; } = string.Empty;
        public DateTime? PostedDate { get; set; }
        public DateTime? UpdatedDate { get; set; }
        public string PostedDateText => PostedDate?.ToString("MM/dd/yyyy HH:mm:ss") ?? string.Empty;
        public string UpdatedDateText => UpdatedDate?.ToString("MM/dd/yyyy HH:mm:ss") ?? string.Empty;
    }
}

