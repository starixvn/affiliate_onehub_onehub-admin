using ONEHub.Domain.Common;

namespace ONEHub.Domain.Entities.Affiliates;

public class MarketingAccount : BaseEntity
{
    public int AffiliateId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public bool IsActive { get; set; }
}

