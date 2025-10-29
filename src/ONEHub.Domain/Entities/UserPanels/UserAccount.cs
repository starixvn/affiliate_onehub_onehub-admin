namespace ONEHub.Domain.Entities.UserPanels;

public class UserAccount
{
    public int AffiliateId { get; set; }
    public string AffiliateName { get; set; } = string.Empty;
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
    public string PreferredPayment { get; set; } = string.Empty;
    public string PlayerUsername { get; set; } = string.Empty;
    public string NetellerAccountId { get; set; } = string.Empty;
    public string MoneybookersEmail { get; set; } = string.Empty;
    public string BankName { get; set; } = string.Empty;
    public string BankAddress { get; set; } = string.Empty;
    public string BankCode { get; set; } = string.Empty;
    public string BankAccountName { get; set; } = string.Empty;
    public string BankAccountNumber { get; set; } = string.Empty;
    public string Question { get; set; } = string.Empty;
    public string Answer { get; set; } = string.Empty;
    public bool? MailOption { get; set; }
    public bool HasHostAffPersonalInfoPermission { get; set; }
    public IEnumerable<ContactApp> ContactAppList { get; set; } = Array.Empty<ContactApp>();
    public bool HasWebSite => !string.IsNullOrEmpty(SiteUrl);
    public string AffiliateCategoryDescription { get; set; } = string.Empty;
    public int PlayerCustomerId { get; set; }
    public int PlayerCurrencyId { get; set; }
}

