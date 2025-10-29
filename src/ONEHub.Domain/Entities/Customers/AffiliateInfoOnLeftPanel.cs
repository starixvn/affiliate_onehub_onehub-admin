namespace ONEHub.Domain.Entities.Customers;

public class AffiliateInfoOnLeftPanel
{
    public int AffiliateId { get; set; }
    public string AffiliateName { get; set; } = string.Empty;
    public string AffiliateCode { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public decimal Balance { get; set; }
}

