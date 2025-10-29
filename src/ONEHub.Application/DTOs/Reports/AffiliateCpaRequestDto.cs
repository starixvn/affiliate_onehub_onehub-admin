namespace ONEHub.Application.DTOs.Reports;

public class AffiliateCpaRequestDto
{
    public string Username { get; set; } = string.Empty;
    public string DealName { get; set; } = string.Empty;
    public short ViewBy { get; set; }
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public short SortType { get; set; }
    public bool SortDirectionType { get; set; }
    public bool IsExportExcel { get; set; }
}

