namespace ONEHub.Application.DTOs.Reports;

public class AffiliateCpaReportDto
{
    public string Month { get; set; } = string.Empty;
    public int AffId { get; set; }
    public string Affiliate { get; set; } = string.Empty;
    public int GroupId { get; set; }
    public string DealName { get; set; } = string.Empty;
    public string DealType { get; set; } = string.Empty;
    public byte ScheduleId { get; set; }
    public string PaymentFrequency { get; set; } = string.Empty;
    public string Quota { get; set; } = string.Empty;
    public long CPAAmount { get; set; }
    public long EstimatedCPAAmount { get; set; }
    public long ApprovedCPAAmount { get; set; }
}

