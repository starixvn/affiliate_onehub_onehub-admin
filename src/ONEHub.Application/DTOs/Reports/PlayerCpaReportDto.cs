namespace ONEHub.Application.DTOs.Reports;

public class PlayerCpaReportDto
{
    private const string Hyphen = "-";
    private const string DateFormat = "MM/dd/yyyy";

    public int MemberCPAId { get; set; }
    public int AffId { get; set; }
    public string AffUserName { get; set; } = string.Empty;
    public int CustId { get; set; }
    public string CustUserName { get; set; } = string.Empty;
    public DateTime? RegisteredDate { get; set; }
    public string RegisteredDateStr => RegisteredDate?.ToString(DateFormat + " HH:mm:ss") ?? Hyphen;
    public int GroupId { get; set; }
    public string DealName { get; set; } = string.Empty;
    public int ScheduleId { get; set; }
    public string ScheduleName { get; set; } = string.Empty;
    public decimal? FTD { get; set; }
    public decimal TotalDeposit { get; set; }
    public bool IsTO { get; set; }
    public int? MemberCpaProductId { get; set; }
    public DateTime AQD { get; set; }
    public string AqdStr => AQD.ToString(DateFormat);
    public decimal CPAAmount { get; set; }
    public int HoldingBetTickets { get; set; }
    public int HoldingTickets { get; set; }
    public DateTime? HQD { get; set; }
    public string HqdStr => HQD?.ToString(DateFormat) ?? Hyphen;
    public DateTime? HED { get; set; }
    public string HedStr => HED?.ToString(DateFormat) ?? Hyphen;
    public decimal? EstimatedCPAAmount { get; set; }
    public decimal? ApprovedCPAAmount { get; set; }
    public string CPAStatus { get; set; } = string.Empty;
    public DateTime? CPADate { get; set; }
    public string CpaDateStr => CPADate?.ToString(DateFormat) ?? Hyphen;
    public bool IsAbnormal { get; set; }
    public string Description { get; set; } = string.Empty;
    public string BetTicket => HoldingBetTickets == 0 && HoldingTickets == 0 ? Hyphen : $"{HoldingBetTickets}/{HoldingTickets}";
}

