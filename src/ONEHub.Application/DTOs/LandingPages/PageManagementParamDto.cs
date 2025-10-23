using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.LandingPages;

public class PageManagementParamDto
{
    [Range(Validation.MinPageIndex, Validation.MaxPageIndex)]
    public int PageIndex { get; set; }

    [Range(Validation.MinPageSize, Validation.MaxPageSize)]
    public int PageSize { get; set; }

    public int CampaignId { get; set; }
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
    public int StatusId { get; set; }
}

