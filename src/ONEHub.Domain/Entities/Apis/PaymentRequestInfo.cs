namespace ONEHub.Domain.Entities.Apis;

public class PaymentRequestInfo
{
    public int CustomerId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public int SiteId { get; set; }
    public decimal Amount { get; set; }
    public int Type { get; set; }
    public string Memo { get; set; } = string.Empty;
    public string ReferenceTransactionId { get; set; } = string.Empty;
}

