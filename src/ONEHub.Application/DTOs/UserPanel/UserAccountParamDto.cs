using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.UserPanel;

public class UserAccountParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
    public int AffId { get; set; }

    [Required]
    public string FirstName { get; set; } = string.Empty;

    [Required]
    public string LastName { get; set; } = string.Empty;

    public bool Gender { get; set; }

    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;

    [Required]
    public string Phone { get; set; } = string.Empty;

    [Required]
    public string ContactApps { get; set; } = string.Empty;

    [Required]
    public string Address { get; set; } = string.Empty;

    [Required]
    public string City { get; set; } = string.Empty;

    public string State { get; set; } = string.Empty;

    [Required]
    public string Postcode { get; set; } = string.Empty;

    [Required]
    public string Country { get; set; } = string.Empty;

    public string SiteUrl { get; set; } = string.Empty;
    public string MoreSiteUrls { get; set; } = string.Empty;
    public string NoSiteDesc { get; set; } = string.Empty;

    [Required]
    public string PreferredPayment { get; set; } = string.Empty;

    public string PlayerUsername { get; set; } = string.Empty;
    public string NetellerAccountId { get; set; } = string.Empty;
    public string MoneybookersEmail { get; set; } = string.Empty;
    public string BankName { get; set; } = string.Empty;
    public string BankAddress { get; set; } = string.Empty;
    public string BankCode { get; set; } = string.Empty;
    public string BankAccountName { get; set; } = string.Empty;
    public string BankAccountNumber { get; set; } = string.Empty;
    public bool MailOption { get; set; }
    public bool IsMarketingAccount { get; set; }
    public int? Player_CustId { get; set; }
    public int? Player_Currency { get; set; }
}

