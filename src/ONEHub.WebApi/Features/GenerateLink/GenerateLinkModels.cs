using System.ComponentModel.DataAnnotations;

namespace ONEHub.WebApi.Features.GenerateLink;

public record InsertLinkRequest(
    [Required] string LinkName,
    string? IdentifierCode,
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
    [Required] string DomainNote,
    [Required] string ShortDomain,
    string ShortPath,
    string? Note
);

