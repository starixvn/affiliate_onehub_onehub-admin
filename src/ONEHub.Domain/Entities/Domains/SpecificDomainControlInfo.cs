using ONEHub.Domain.Common;

namespace ONEHub.Domain.Entities.Domains;

public class SpecificDomainControlInfo : BaseEntity, IAuditableEntity
{
    public int SpecificDomainControlId { get; set; }
    public string AffiliateUsername { get; set; } = string.Empty;
    public string AffiliateDomain { get; set; } = string.Empty;
    public bool AffiliateDomainIsSSL { get; set; }
    public string RedirectDomain { get; set; } = string.Empty;
    public bool RedirectDomainIsSSL { get; set; }
    public bool Status { get; set; }
    public string Creator { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public string Editor { get; set; } = string.Empty;
    public DateTime? UpdatedDate { get; set; }
    public bool IsMobile { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string ModifiedBy { get; set; } = string.Empty;
}

