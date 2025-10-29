namespace ONEHub.Application.DTOs.Reports;

public class PlayerCpaReportRequestDto
{
    public string UserName { get; set; } = string.Empty;
    public string CustName { get; set; } = string.Empty;
    public string DealName { get; set; } = string.Empty;
    public short StatusId { get; set; }
    public short ViewBy { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 20;
}

