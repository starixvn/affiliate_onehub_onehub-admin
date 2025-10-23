using ONEHub.Domain.Common;
using ONEHub.Domain.Enums;

namespace ONEHub.Domain.Entities.Affiliates;

public class Affiliate : BaseEntity, IAuditableEntity
{
    public int AffiliateId { get; set; }
    public int AffiliateCode { get; set; }
    public int? ParentAffiliateId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public AffiliateStatus Status { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
    public string CurrencyCode { get; set; } = string.Empty;
    public int? CommissionGroupId { get; set; }
    public bool IsUsingPrivateCommissionGroup { get; set; }
    public DateTime RegistrationDate { get; set; }
    public DateTime? ApprovalDate { get; set; }
    public string ApprovedBy { get; set; } = string.Empty;
    public decimal BalanceBroughtForward { get; set; }
    public bool IsFavorite { get; set; }
    public bool IsClosed { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string ModifiedBy { get; set; } = string.Empty;
}

