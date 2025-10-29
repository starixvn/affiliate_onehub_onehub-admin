namespace ONEHub.Domain.Entities.Affiliates;

public class CreateMarketingAccountModel
{
    public int AffiliateId { get; set; }
    public string ParentAffiliateName { get; set; } = string.Empty;
    public string AffiliateCode { get; set; } = string.Empty;
    public string AffiliateName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool IsPrivate { get; set; }
    public int AffiliateType { get; set; }
    public int GroupId { get; set; }
    public string PreferredLanguage { get; set; } = string.Empty;
    public string TargetCountryCode { get; set; } = string.Empty;
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
    public int QuestionId { get; set; }
    public string Answer { get; set; } = string.Empty;
    public string SiteUrl { get; set; } = string.Empty;
    public string MoreSiteUrls { get; set; } = string.Empty;
    public string NoSiteDescription { get; set; } = string.Empty;
    public string PreferredPayment { get; set; } = string.Empty;
    public string PlayerUsername { get; set; } = string.Empty;
    public int? PlayerCustomerId { get; set; }
    public int? PlayerCurrencyId { get; set; }
    public bool? MailOption { get; set; }
}

