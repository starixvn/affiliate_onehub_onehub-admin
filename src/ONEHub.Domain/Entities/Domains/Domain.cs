using ONEHub.Domain.Common;

namespace ONEHub.Domain.Entities.Domains;

public class Domain : BaseEntity
{
    public string DomainName { get; set; } = string.Empty;
    public string DomainUrl { get; set; } = string.Empty;
    public string TargetCountryCode { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public bool IsDefault { get; set; }
}

