namespace ONEHub.Domain.Params;

public class PageManagementDashboardParam : BaseParam
{
    public string? Search { get; set; } = string.Empty;
    public string? StatusIds { get; set; } = string.Empty;
    public string? TargetCountryCodes { get; set; } = string.Empty;
    public string? LanguageCodes { get; set; } = string.Empty;
    public DateTime? FromDate { get; set; }
    public DateTime? ToDate { get; set; }
}

public class LandingPageListParam : PagingParam
{
    public string? Search { get; set; } = string.Empty;

    public string? StatusIds { get; set; } = string.Empty;

    public string? TargetCountryCodes { get; set; } = string.Empty;

    public string? LanguageCodes { get; set; } = string.Empty;

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public bool? IsExportExcel { get; set; } = false;
}

public class UpdateBatchLandingPageStatusParam : BaseParam
{
    public string PageIds { get; set; } = string.Empty;

    public int StatusId { get; set; }
}

public class DeleteBatchLandingPageParam : BaseParam
{
    public string PageIds { get; set; } = string.Empty;
}
