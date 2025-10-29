using ONEHub.Domain.Enums;

namespace ONEHub.Application.DTOs.Affiliates;

public class AffiliateDto
{
    public int AffiliateId { get; set; }
    public int AffiliateCode { get; set; }
    public int? ParentAffiliateId { get; set; }
    public string ParentAffiliateName { get; set; } = string.Empty;
    public int? SubAffiliateCount { get; set; }
    public string UserName { get; set; } = string.Empty;
    public AffiliateStatus Status { get; set; }
    public string StatusText => Status.ToString();
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string FullName => $"{FirstName} {LastName}".Trim();
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public DateTime RegistrationDate { get; set; }
    public DateTime? ApprovalDate { get; set; }
    public string CommissionGroupName { get; set; } = string.Empty;
    public decimal BalanceBroughtForward { get; set; }
    public int MemberCount { get; set; }
    public bool IsFavorite { get; set; }
    public string CurrencyCode { get; set; } = string.Empty;
    public string ApprovedBy { get; set; } = string.Empty;
    public bool IsUsingPrivateCommissionGroup { get; set; }
}

