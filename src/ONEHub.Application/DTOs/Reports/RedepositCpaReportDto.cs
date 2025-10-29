namespace ONEHub.Application.DTOs.Reports;

public class RedepositCpaReportDto
{
    public int RowIdx { get; set; }
    public int AffId { get; set; }
    public string AffUserName { get; set; } = string.Empty;
    public int DealId { get; set; }
    public string DealName { get; set; } = string.Empty;
    public string PaymentFrequency { get; set; } = string.Empty;
    public DateTime? StartFrom { get; set; }
    public string StartFromStr => StartFrom?.ToString("MM/dd/yyyy") ?? string.Empty;
    public DateTime? ApprovalDate { get; set; }
    public string ApprovalDateStr => ApprovalDate?.ToString("MM/dd/yyyy") ?? string.Empty;
    public int RecheckDays { get; set; }
    public DateTime? ExpiredRedepositDate { get; set; }
    public string ExpiredRedepositDateStr => ExpiredRedepositDate?.ToString("MM/dd/yyyy") ?? string.Empty;
    public int ApprovedCpaPlayer { get; set; }
    public decimal RedepositRate { get; set; }
    public int ApprovedCpaPlayerRate { get; set; }
    public string NumOfPlayerRedeposit { get; set; } = string.Empty;
    public decimal TotalSettledCpaAmount { get; set; }
    public string Status { get; set; } = string.Empty;
}

