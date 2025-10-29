namespace ONEHub.Domain.Entities.Reports;

public class PlayerCpaReport
{
    public int MemberCpaId { get; set; }
    public int AffiliateId { get; set; }
    public string AffiliateUserName { get; set; } = string.Empty;
    public int CustomerId { get; set; }
    public string CustomerUserName { get; set; } = string.Empty;
    public DateTime? RegisteredDate { get; set; }
    public int GroupId { get; set; }
    public string DealName { get; set; } = string.Empty;
    public int ScheduleId { get; set; }
    public string ScheduleName { get; set; } = string.Empty;
    public decimal? FirstTimeDeposit { get; set; }
    public decimal TotalDeposit { get; set; }
    public bool IsTurnoverReached { get; set; }
    public int? MemberCpaProductId { get; set; }
    public DateTime AchievedQualifiedDate { get; set; }
    public decimal CpaAmount { get; set; }
    public int HoldingBetTickets { get; set; }
    public int HoldingTickets { get; set; }
    public DateTime? HoldingQualifiedDate { get; set; }
    public DateTime? HoldingEndDate { get; set; }
    public decimal? EstimatedCpaAmount { get; set; }
    public decimal? ApprovedCpaAmount { get; set; }
    public string CpaStatus { get; set; } = string.Empty;
    public DateTime? CpaDate { get; set; }
    public bool IsAbnormal { get; set; }
    public string Description { get; set; } = string.Empty;
}

