namespace ONEHub.Domain.Entities.Reports;

public class AffiliateCpaReport
{
    public string Month { get; set; } = string.Empty;
    public int AffiliateId { get; set; }
    public string Affiliate { get; set; } = string.Empty;
    public int GroupId { get; set; }
    public string DealName { get; set; } = string.Empty;
    public string DealType { get; set; } = string.Empty;
    public byte ScheduleId { get; set; }
    public string PaymentFrequency { get; set; } = string.Empty;
    public string Quota { get; set; } = string.Empty;
    public long CpaAmount { get; set; }
    public long EstimatedCpaAmount { get; set; }
    public long ApprovedCpaAmount { get; set; }
}

