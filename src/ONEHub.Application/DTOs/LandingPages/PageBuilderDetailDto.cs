namespace ONEHub.Application.DTOs.LandingPages;

public class PageBuilderDetailDto
{
    public string PageName { get; set; } = string.Empty;
    public string PageCode { get; set; } = string.Empty;
    public int CampaignId { get; set; }
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
    public string DealIds { get; set; } = string.Empty;
    public int StatusId { get; set; }
    public bool IsPreview { get; set; }
    public int PageId { get; set; }
    public IEnumerable<ModuleComponentItemDto> ModuleComponentsSetting { get; set; } = new List<ModuleComponentItemDto>();
}

public class ModuleComponentItemDto
{
    public int ModuleId { get; set; }
    public string ModuleName { get; set; } = string.Empty;
    public int ModuleType { get; set; }
    public string Value { get; set; } = string.Empty;
}

