namespace ONEHub.Application.DTOs.Domains;

public class DomainControlInfoDto
{
    public int DomainControlId { get; set; }
    public int DomainId { get; set; }
    public int AffDomainId { get; set; }
    public string AffDomain { get; set; } = string.Empty;
    public int RedirectDomainId { get; set; }
    public string RedirectDomain { get; set; } = string.Empty;
    public string TargetCountryCode { get; set; } = string.Empty;
    public string TargetCountryName { get; set; } = string.Empty;
    public bool IsUsed { get; set; }
    public string Creator { get; set; } = string.Empty;
    public DateTime? CreatedDate { get; set; }
    public bool IsMobile { get; set; }
    public bool IsExcluded { get; set; }
    public string DealIds { get; set; } = string.Empty;
}

