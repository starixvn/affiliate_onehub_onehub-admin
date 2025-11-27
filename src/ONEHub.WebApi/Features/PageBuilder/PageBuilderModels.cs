using System.ComponentModel.DataAnnotations;
using ONEHub.Domain.Entities;

namespace ONEHub.WebApi.Features.PageBuilder;

public record CreateLandingPageRequest(
    [Required][MaxLength(100)] string PageCode,
    [Required] string PageName,
    [Required] int CampaignId,
    [Required] string TargetCountryCode,
    [Required] string LanguageCode,
    [Required] bool IsPreview,
    [Required] int StatusId,
    int PageId,
    IEnumerable<ModuleComponentItem> ModuleComponentSettings
);

public record UpdateLandingPageRequest(
    [Required][MaxLength(100)] string PageCode,
    [Required] string PageName,
    [Required] int CampaignId,
    [Required] string TargetCountryCode,
    [Required] string LanguageCode,
    [Required] bool IsPreview,
    [Required] int StatusId
);

public record GetPageBuilderDetailRequest(
    [Required] int PageId,
    string? PageCode,
    bool IsPreview
);

public record GetMediaRequest(
    [Required] int ModuleId,
    string TargetCountryCode,
    string LanguageCode);
