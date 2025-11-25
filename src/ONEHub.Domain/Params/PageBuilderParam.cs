namespace ONEHub.Domain.Params;

public class MediaSourceParam
{
    public int ModuleId { get; set; }
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
}

public class ModuleComponentParam
{
    public int ModuleId { get; set; }
    public int MediaId { get; set; }
    public string ExtraInfo { get; set; } = string.Empty;
    public int OrderId { get; set; }
}

public class BaseLandingPageParam : BaseParam
{
    public string PageName { get; set; } = string.Empty;
    public int CampaignId { get; set; }
    public string ModuleComponentsSetting { get; set; } = string.Empty;
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
    public int StatusId { get; set; }
}

public class CreateLandingPageParam : BaseLandingPageParam
{
    public string PageCode { get; set; } = string.Empty;
    public bool IsPreview { get; set; }
}

public class UpdateLandingPageParam : BaseLandingPageParam
{
    public int PageId { get; set; }
}
