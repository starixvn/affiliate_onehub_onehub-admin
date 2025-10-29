using ONEHub.Domain.DTOs.Common;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Domain.DTOs.LandingPages;

public class PageManagementRequest : PagingRequest
{
    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string TargetCountryCodes { get; set; } = string.Empty;

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string LanguageCodes { get; set; } = string.Empty;

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string DealIds { get; set; } = string.Empty;

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string StatusIds { get; set; } = string.Empty;

    public string? LandingPageName { get; set; }
    public string? CampaignName { get; set; }
}

