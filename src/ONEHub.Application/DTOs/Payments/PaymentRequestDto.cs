namespace ONEHub.Application.DTOs.Payments;

public class PaymentRequestDto
{
    public long TransId { get; set; }
    public DateTime TransDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string AffName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime CompletedDate { get; set; }
    public string Creator { get; set; } = string.Empty;
    public string TransDateText => TransDate.ToString("MM/dd/yyyy HH:mm:ss");
    public string CompletedDateText => CompletedDate.ToString("MM/dd/yyyy HH:mm:ss");
}

