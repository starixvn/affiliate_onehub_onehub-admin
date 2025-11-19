using System.ComponentModel.DataAnnotations;

namespace ONEHub.WebApi.Features.GenerateLink;

public record InsertLinkRequest(
    [Required][MaxLength(200)] string LinkName,
    [MaxLength(20)][RegularExpression(@"^[a-zA-Z0-9]*$")] string IdentifierCode,
    [Required] int CampaignId,
    [Required] string CampaignCode,
    [Required] string CountryCode,
    [Required] string MarketId,
    [Required] string ShortedLanguageCode,
    [Required] string EventIds,
    [Required] string EventCodes,
    [Required] int GroupId,
    [Required] string GroupCode,
    [Required] int ChannelId,
    [Required] string ChannelCode,
    [Required] int AgencyId,
    [Required] string AgencyCode,
    [Required] int TypeId,
    [Required] string TypeCode,
    [Required] int PageType,
    [Required] string PageCode,
    [Required] string DomainName,
    [Required][MaxLength(200)] string DomainNote,
    [Required] string ShortDomain,
    [RegularExpression(@"^(|[a-z0-9\-.]{5,20})$", ErrorMessage = "Short path must be empty or contain 5-20 lowercase letters, numbers, hyphens, and dots")]
    string ShortPath,
    string? Note
);

