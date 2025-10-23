using ONEHub.Application.Common;

namespace ONEHub.Application.Affiliates.Commands;

public class CreateMarketingAccountCommand : BaseCommand<int>
{
    public int AffiliateType { get; set; }
    public string Password { get; set; } = string.Empty;
    public int GroupId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool? Gender { get; set; }
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string ContactApps { get; set; } = string.Empty;
    public string Address { get; set; } = string.Empty;
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Postcode { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string SiteUrl { get; set; } = string.Empty;
    public string MoreSiteUrls { get; set; } = string.Empty;
    public string NoSiteDescription { get; set; } = string.Empty;
    public string PreferredLanguage { get; set; } = string.Empty;
    public int QuestionId { get; set; }
    public string Answer { get; set; } = string.Empty;
    public string PreferredPayment { get; set; } = string.Empty;
    public int? PlayerCustomerId { get; set; }
    public string PlayerUsername { get; set; } = string.Empty;
    public int? PlayerCurrencyId { get; set; }
    public string TargetCountryCode { get; set; } = string.Empty;
}

