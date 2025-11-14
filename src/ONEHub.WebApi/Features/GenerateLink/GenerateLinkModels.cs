using System.ComponentModel.DataAnnotations;

namespace ONEHub.WebApi.Features.GenerateLink;

public record InsertLinkRequest(
    [Required][MaxLength(200)] string LinkName,
    [MaxLength(20)][RegularExpression(@"^[a-zA-Z0-9]*$")] string? IdentifierCode,
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
    [Required] string LandingPage,
    [Required] int PageType,
    [Required] string PageCode,
    [Required] string DomainName,
    [Required][MaxLength(200)] string DomainNote,
    [Required] string ShortDomain,
    [MinLength(5)][MaxLength(20)][RegularExpression(@"^[a-z0-9]*$")] string ShortPath,
    string? Note
);

