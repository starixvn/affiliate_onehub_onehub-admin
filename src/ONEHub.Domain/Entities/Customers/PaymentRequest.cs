using ONEHub.Domain.Common;
using ONEHub.Domain.Enums;

namespace ONEHub.Domain.Entities.Customers;

public class PaymentRequest : BaseEntity, IAuditableEntity
{
    public int AffiliateId { get; set; }
    public decimal Amount { get; set; }
    public string CurrencyCode { get; set; } = string.Empty;
    public PaymentMethodType PaymentMethod { get; set; }
    public string BankName { get; set; } = string.Empty;
    public string AccountNumber { get; set; } = string.Empty;
    public string AccountHolder { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime RequestDate { get; set; }
    public DateTime? ProcessedDate { get; set; }
    public string ProcessedBy { get; set; } = string.Empty;
    public string Remarks { get; set; } = string.Empty;
    public string CreatedBy { get; set; } = string.Empty;
    public string ModifiedBy { get; set; } = string.Empty;
}

