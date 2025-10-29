namespace ONEHub.Application.DTOs.EmailHistory
{
    public class EmailHistoryInfoDto
    {
        public int EmailId { get; set; }
        public string Sender { get; set; } = string.Empty;
        public string AffName { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime SentDate { get; set; }
        public string SentDateText => SentDate.ToString("MM/dd/yyyy HH:mm:ss");
    }
}

