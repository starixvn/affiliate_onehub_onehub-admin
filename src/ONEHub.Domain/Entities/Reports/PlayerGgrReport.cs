namespace ONEHub.Domain.Entities.Reports;

public class PlayerGgrReport
{
    public string AffiliateName { get; set; } = string.Empty;
    public string PlayerName { get; set; } = string.Empty;
    public DateTime? RegistrationDate { get; set; }
    public DateTime? FirstDepositDate { get; set; }
    public decimal TotalTurnover { get; set; }
    public decimal TotalGgr { get; set; }
    public IDictionary<string, PlayerGgrProductInfo> ProductReportList { get; set; } = new Dictionary<string, PlayerGgrProductInfo>();
}

