namespace ONEHub.Application.DTOs.Affiliates;

public record MarketingAccountDto
{
    public int AffiliateId { get; init; }
    public string ParentAffiliateName { get; init; } = string.Empty;
    public string AffiliateCode { get; init; } = string.Empty;
    public string Status { get; init; } = string.Empty;
    public bool IsPrivate { get; init; }
    public int AffiliateType { get; init; }
    public int GroupId { get; init; }
    public string PreferredLanguage { get; init; } = string.Empty;
    public string TargetCountryName { get; init; } = string.Empty;
    public string TargetCountryCode { get; init; } = string.Empty;
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public bool Gender { get; init; }
    public string Email { get; init; } = string.Empty;
    public string Phone { get; init; } = string.Empty;
    public string ContactApps { get; init; } = string.Empty;
    public string Address { get; init; } = string.Empty;
    public string City { get; init; } = string.Empty;
    public string State { get; init; } = string.Empty;
    public string Postcode { get; init; } = string.Empty;
    public string Country { get; init; } = string.Empty;
    public string Question { get; init; } = string.Empty;
    public int QuestionId { get; init; }
    public string Answer { get; init; } = string.Empty;
    public string SiteUrl { get; init; } = string.Empty;
    public string MoreSiteUrls { get; init; } = string.Empty;
    public string NoSiteDescription { get; init; } = string.Empty;
    public string PreferredPayment { get; init; } = string.Empty;
    public string PlayerUsername { get; init; } = string.Empty;
    public string NetellerAccountId { get; init; } = string.Empty;
    public string MoneybookersEmail { get; init; } = string.Empty;
    public string BankName { get; init; } = string.Empty;
    public string BankAddress { get; init; } = string.Empty;
    public string BankCode { get; init; } = string.Empty;
    public string BankAccountName { get; init; } = string.Empty;
    public string BankAccountNumber { get; init; } = string.Empty;
    public bool? MailOption { get; init; }
    public bool HasHostAffPersonalInfoPermission { get; init; }
    public int PlayerCustomerId { get; init; }
    public string PlayerCurrency { get; init; } = string.Empty;
    public int PlayerCurrencyId { get; init; }
    public IEnumerable<ContactAppDto> ContactAppList { get; init; } = Array.Empty<ContactAppDto>();
}

public record ContactAppDto
{
    public string Name { get; init; } = string.Empty;
    public string Value { get; init; } = string.Empty;
    public int Order { get; init; }
}

