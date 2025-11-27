namespace ONEHub.Domain.Entities;

public class PageBuilderDetail
{
    public string PageName { get; set; } = string.Empty;
    public string PageCode { get; set; } = string.Empty;
    public int CampaignId { get; set; }
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
    public int StatusId { get; set; }
    public bool IsPreview { get; set; }
    public int PageId { get; set; }
    public IEnumerable<ModuleComponentItem> ModuleComponentSettings { get; set; }
}
