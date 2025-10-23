namespace ONEHub.Domain.Entities.Payments;

public class PaymentRequest
{
    public long TransactionId { get; set; }
    public DateTime TransactionDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string AffiliateName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime CompletedDate { get; set; }
    public string Creator { get; set; } = string.Empty;
}

