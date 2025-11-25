using System.ComponentModel.DataAnnotations;

namespace ONEHub.WebApi.Features.PageBuilder;

public record GetLandingPageDetailRequest(
    int PageId,
    bool IsClone);

public record GetMediaSourceRequest(
    [Required] int ModuleId,
    [Required] string TargetCountryCode,
    [Required] string LanguageCode);

public record ModuleComponentRequest(
    [Required] int ModuleId,
    [Required] int MediaId,
    string ExtraInfo,
    [Required] int OrderId
    );

public record CreateLandingPageRequest(
    [Required] string LpName,
    [Required] string LpCode,
    [Required] int CampaignId,
    [Required] string TargetCountryCode,
    [Required] string LanguageCode,
    [Required] int StatusId,
    [Required] bool IsPreview,
    [Required] IEnumerable<ModuleComponentRequest> ModuleComponentsSetting
    );

public record UpdateLandingPageRequest(
    [Required] int PageId,
    [Required] string LpName,
    [Required] int CampaignId,
    [Required] string TargetCountryCode,
    [Required] string LanguageCode,
    [Required] int StatusId,
    [Required] IEnumerable<ModuleComponentRequest> ModuleComponentsSetting
    );
