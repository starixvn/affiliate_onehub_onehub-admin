namespace ONEHub.Application.DTOs.Reports;

public class AffiliateReportParamDto
{
    public string UserName { get; set; } = string.Empty;
    public DateTime FromDate { get; set; }
    public DateTime ToDate { get; set; }
    public string PreferredLanguage { get; set; } = string.Empty;
    public string GroupIds { get; set; } = string.Empty;
    public bool IsGetAll { get; set; }
    public string ProductIds { get; set; } = string.Empty;
    public byte SortType { get; set; }
    public byte SortDirectionType { get; set; }
    public int PageIndex { get; set; } = 1;
    public int PageSize { get; set; } = 20;
    public bool IsExportExcel { get; set; }
    public int BaseCurrencyId { get; set; }
    public string CurrencyIds { get; set; } = string.Empty;
    public string PaymentCurrencyIds { get; set; } = string.Empty;
    public string EarningBy { get; set; } = string.Empty;
    public bool IsExcludeNegvBBF { get; set; }
    public bool IsExcludeNegvCurrentBBF { get; set; }
    public bool IsGetMonthly { get; set; }
    public string Statuses { get; set; } = string.Empty;
}

