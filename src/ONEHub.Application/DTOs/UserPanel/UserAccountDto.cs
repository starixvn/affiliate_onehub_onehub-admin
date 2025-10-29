namespace ONEHub.Application.DTOs.UserPanel;

public class UserAccountDto
{
    public int AffId { get; set; }
    public string AffName { get; set; } = string.Empty;
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
    public string NoSiteDesc { get; set; } = string.Empty;
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
    public string AffCategoryDesc { get; set; } = string.Empty;
    public int PlayerCustId { get; set; }
    public int PlayerCurrencyId { get; set; }
}

