using ONEHub.Domain.Common;

namespace ONEHub.Domain.Entities.Domains;

public class DomainControlInfo : BaseEntity
{
    public int DomainControlId { get; set; }
    public int DomainId { get; set; }
    public int AffiliateDomainId { get; set; }
    public string AffiliateDomain { get; set; } = string.Empty;
    public int RedirectDomainId { get; set; }
    public string RedirectDomain { get; set; } = string.Empty;
    public string TargetCountryCode { get; set; } = string.Empty;
    public string TargetCountryName { get; set; } = string.Empty;
    public bool IsUsed { get; set; }
    public string Creator { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public bool IsMobile { get; set; }
    public bool IsExcluded { get; set; }
    public string DealIds { get; set; } = string.Empty;
}

