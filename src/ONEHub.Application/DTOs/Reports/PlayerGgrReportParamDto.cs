namespace ONEHub.Application.DTOs.Reports;

public class PlayerGgrReportParamDto
{
    public string AffName { get; set; } = string.Empty;
    public string PlayerName { get; set; } = string.Empty;
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string ProductIds { get; set; } = string.Empty;
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public bool IsExportExcel { get; set; }
    public int BaseCurrencyId { get; set; }
}

