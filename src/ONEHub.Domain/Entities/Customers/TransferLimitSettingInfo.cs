namespace ONEHub.Domain.Entities.Customers;

public class TransferLimitSettingInfo
{
    public int AffiliateId { get; set; }
    public decimal MinTransferAmount { get; set; }
    public decimal MaxTransferAmount { get; set; }
    public int TransferCount { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public string ModifiedBy { get; set; } = string.Empty;
    public DateTime? ModifiedDate { get; set; }
}

