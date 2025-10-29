namespace ONEHub.Domain.Entities.EmailHistories;

public class EmailHistoryInfo
{
    public int EmailId { get; set; }
    public string Sender { get; set; } = string.Empty;
    public string AffiliateName { get; set; } = string.Empty;
    public string Subject { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime SentDate { get; set; }
}

