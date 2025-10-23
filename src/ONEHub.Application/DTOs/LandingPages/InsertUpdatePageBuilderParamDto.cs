using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.LandingPages;

public class InsertUpdatePageBuilderParamDto
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
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
    public string ModuleComponentsJson { get; set; } = string.Empty;
}

