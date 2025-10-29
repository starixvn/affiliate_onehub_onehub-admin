namespace ONEHub.Domain.Entities.Reports;

public class TransferReport
{
    public int TransactionId { get; set; }
    public DateTime CreatedDate { get; set; }
    public string AffiliateName { get; set; } = string.Empty;
    public string AffiliatePlayerName { get; set; } = string.Empty;
    public string PlayerName { get; set; } = string.Empty;
    public string PlayerCurrency { get; set; } = string.Empty;
    public string AffiliatePlayerCurrency { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public decimal AffiliatePlayerAmount { get; set; }
    public decimal BasedAmount { get; set; }
}

