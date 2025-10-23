namespace ONEHub.Domain.Entities.Payments;

public class PaymentRequestDetail
{
    public int PaymentRequestId { get; set; }
    public int AffiliateId { get; set; }
    public string AffiliateName { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public string Currency { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime RequestDate { get; set; }
    public DateTime? ProcessedDate { get; set; }
    public string ProcessedBy { get; set; } = string.Empty;
}

