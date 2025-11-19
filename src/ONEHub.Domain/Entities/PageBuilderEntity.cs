using ONEHub.Domain.Entities.LandingPages;

namespace ONEHub.Domain.Entities;

public class MediaSourceInfo : MediaItem
{
    public int ModuleId { get; set; }

    public int MediaId { get; set; }
}

public class ModuleComponentItem
{
    public int ModuleId { get; set; }
    public int? MediaId { get; set; }
    public string ExtraInfo { get; set; } = string.Empty;
    public int OrderId { get; set; }
}

public class PageBuilder
{
    public string PageName { get; set; } = string.Empty;
    public string PageCode { get; set; } = string.Empty;
    public int CampaignId { get; set; }
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
    public int StatusId { get; set; }
    public bool IsPreview { get; set; }
    public int PageId { get; set; }
    public IEnumerable<ModuleComponentItem> ModuleComponentsSetting { get; set; } = new List<ModuleComponentItem>();
}
