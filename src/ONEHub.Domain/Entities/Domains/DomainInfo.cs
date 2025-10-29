using ONEHub.Domain.Common;

namespace ONEHub.Domain.Entities.Domains;

public class DomainInfo : BaseEntity
{
    public int DomainId { get; set; }
    public string DomainName { get; set; } = string.Empty;
    public bool IsSSL { get; set; }
    public string Creator { get; set; } = string.Empty;
    public string BlockTargetCountry { get; set; } = string.Empty;
    public string BlockTargetCountryCode { get; set; } = string.Empty;
    public DateTime CreateDate { get; set; }
}

