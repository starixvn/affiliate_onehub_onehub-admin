namespace ONEHub.Application.DTOs.Messages
{
    public class MessageDetailDto
    {
        public int MessageId { get; set; }
        public bool Important { get; set; }
        public string Message_en { get; set; } = string.Empty;
        public string Message_id { get; set; } = string.Empty;
        public string Message_ko { get; set; } = string.Empty;
        public string Message_th { get; set; } = string.Empty;
        public string Message_vn { get; set; } = string.Empty;
        public string Message_cs { get; set; } = string.Empty;
    }
}

