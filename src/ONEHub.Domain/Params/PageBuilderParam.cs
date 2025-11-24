namespace ONEHub.Domain.Params;

public class PageBuilderParam : BaseParam
{
    public int PageId { get; set; }
    public string PageCode { get; set; } = string.Empty;
    public string PageName { get; set; } = string.Empty;
    public bool IsPreview { get; set; }
    public int CampaignId { get; set; }
    public string ComponentStructure { get; set; } = string.Empty;
    public string TargetCountryCode { get; set; } = string.Empty;
    public string MarketId { get; set; } = string.Empty;
    public int StatusId { get; set; }
}

public class GetMediaParam : BaseParam
{
    public int ModuleId { get; set; }

    public string TargetCountryCode { get; set; } = string.Empty;

    public string LanguageCode { get; set; } = string.Empty;
}

public class GetPageBuilderParam : BaseParam
{
    public int PageId { get; set; }

    public string PageCode { get; set; } = string.Empty;

    public bool IsPreview { get; set; }
}

