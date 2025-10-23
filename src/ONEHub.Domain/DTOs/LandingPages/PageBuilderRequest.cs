using ONEHub.Domain.Entities.LandingPages;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Domain.DTOs.LandingPages;

public class PageBuilderRequest
{
    public int PageId { get; set; }

    [Required]
    public string PageName { get; set; } = string.Empty;

    [Required]
    public string PageCode { get; set; } = string.Empty;

    public int CampaignId { get; set; }
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
    public string DealIds { get; set; } = string.Empty;
    public int StatusId { get; set; }
    public bool IsPreview { get; set; }
    public IList<ModuleComponentItem> ModuleComponentsSetting { get; set; } = new List<ModuleComponentItem>();
}

public class MediaSourceRequest
{
    public int ModuleId { get; set; }
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
}

public class InsertLandingPageDealRequest
{
    public int PageId { get; set; }
    public int CampaignId { get; set; }
}

