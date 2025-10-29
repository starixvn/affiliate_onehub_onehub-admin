namespace ONEHub.Application.DTOs.Reports;

public class PlayerGgrReportDto
{
    public string AffName { get; set; } = string.Empty;
    public string PlayerName { get; set; } = string.Empty;
    public DateTime? RegistrationDate { get; set; }
    public DateTime? FdmDate { get; set; }
    public decimal TotalTurnover { get; set; }
    public decimal TotalGgr { get; set; }
    public IDictionary<string, PlayerGgrProductInfoDto> ProductReportList { get; set; } = new Dictionary<string, PlayerGgrProductInfoDto>();
    public string RegistrationDateText => RegistrationDate?.ToString("MM/dd/yyyy HH:mm:ss") ?? string.Empty;
    public string FdmDateText => FdmDate?.ToString("MM/dd/yyyy HH:mm:ss") ?? string.Empty;
}

public class PlayerGgrProductInfoDto
{
    public decimal Turnover { get; set; }
    public decimal Ggr { get; set; }
}

