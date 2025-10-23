namespace ONEHub.Domain.Entities.Reports;

public class RedepositCpaReport
{
    public int RowIndex { get; set; }
    public int AffiliateId { get; set; }
    public string AffiliateUserName { get; set; } = string.Empty;
    public int DealId { get; set; }
    public string DealName { get; set; } = string.Empty;
    public string PaymentFrequency { get; set; } = string.Empty;
    public DateTime? StartFrom { get; set; }
    public DateTime? ApprovalDate { get; set; }
    public int RecheckDays { get; set; }
    public DateTime? ExpiredRedepositDate { get; set; }
    public int ApprovedCpaPlayer { get; set; }
    public decimal RedepositRate { get; set; }
    public int ApprovedCpaPlayerRate { get; set; }
    public string NumberOfPlayerRedeposit { get; set; } = string.Empty;
    public decimal TotalSettledCpaAmount { get; set; }
    public string Status { get; set; } = string.Empty;
}

