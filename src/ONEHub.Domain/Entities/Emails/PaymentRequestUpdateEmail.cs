namespace ONEHub.Domain.Entities.Emails;

public class PaymentRequestUpdateEmail : EmailBase
{
    public long TransactionId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string TransactionDate { get; set; } = string.Empty;
    public bool IsApproved { get; set; }
    public string DefaultCurrency { get; set; } = string.Empty;
}

