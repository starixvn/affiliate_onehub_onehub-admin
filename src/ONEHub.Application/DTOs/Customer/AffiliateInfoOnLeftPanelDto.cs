namespace ONEHub.Application.DTOs.Customer;

public class AffiliateInfoOnLeftPanelDto
{
    public int? ParentAffId { get; set; }
    public string ParentAffName { get; set; } = string.Empty;
    public int AffId { get; set; }
    public string AffCode { get; set; } = string.Empty;
    public int GroupId { get; set; }
    public string AffName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public bool Gender { get; set; }
    public string ContactApps { get; set; } = string.Empty;
    public string SiteUrl { get; set; } = string.Empty;
    public string MoreSiteUrls { get; set; } = string.Empty;
    public string NoSiteDesc { get; set; } = string.Empty;
    public DateTime? LastLoginDate { get; set; }
    public string LastLoginIp { get; set; } = string.Empty;
    public string CommGroupName { get; set; } = string.Empty;
    public decimal BalanceBf { get; set; }
    public string Status { get; set; } = string.Empty;
    public int AffType { get; set; }
    public string PreferredLanguage { get; set; } = string.Empty;
    public string TargetCountryName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string AffLink { get; set; } = string.Empty;
    public bool IsUsingPrivateCommGroup { get; set; }
    public string ApprovedBy { get; set; } = string.Empty;
    public bool IsDepositFeePercent { get; set; }
    public bool IsWithdrawalFeePercent { get; set; }
    public bool IsDisabledTransfer { get; set; }
    public decimal TransferLimit { get; set; }
    public string PlayerCurrency { get; set; } = string.Empty;
    public int GroupTypeId { get; set; }
    public string DealTypeName { get; set; } = string.Empty;
}

