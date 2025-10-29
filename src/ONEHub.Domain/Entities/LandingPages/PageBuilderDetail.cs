namespace ONEHub.Domain.Entities.LandingPages;

public class PageBuilderDetail
{
    public string PageName { get; set; }
    public string PageCode { get; set; }
    public int CampaignId { get; set; }
    public string TargetCountryCode { get; set; }
    public string LanguageCode { get; set; }
    public string DealIds { get; set; }
    public int StatusId { get; set; }
    public bool IsPreview { get; set; }
    public int PageId { get; set; }
    public IEnumerable<ModuleComponentItem> ModuleComponentsSetting { get; set; }
}
