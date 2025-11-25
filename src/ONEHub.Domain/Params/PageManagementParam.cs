namespace ONEHub.Domain.Params;

public class PageManagementDashboardParam : BaseParam
{
}

public class LandingPageListParam : PagingParam
{
    public string? Search { get; set; }

    public string? StatusIds { get; set; }

    public string? TargetCountryCodes { get; set; }

    public string? LanguageCodes { get; set; }

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
