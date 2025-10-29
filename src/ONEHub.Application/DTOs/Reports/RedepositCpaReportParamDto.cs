namespace ONEHub.Application.DTOs.Reports;

public class RedepositCpaReportParamDto
{
    public string AffName { get; set; } = string.Empty;
    public string DealName { get; set; } = string.Empty;
    public int StatusId { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public bool IsExportExcel { get; set; }
}

