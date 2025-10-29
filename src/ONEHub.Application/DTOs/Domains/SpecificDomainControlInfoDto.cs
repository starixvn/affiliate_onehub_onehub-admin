namespace ONEHub.Application.DTOs.Domains;

public class SpecificDomainControlInfoDto
{
    public int SpecificDomainControlId { get; set; }
    public string AffUsername { get; set; } = string.Empty;
    public string AffDomain { get; set; } = string.Empty;
    public bool AffDomainIsSSL { get; set; }
    public string RedirectDomain { get; set; } = string.Empty;
    public bool RedirectDomainIsSSL { get; set; }
    public bool Status { get; set; }
    public bool IsMobile { get; set; }
    public string Creator { get; set; } = string.Empty;
    public DateTime? CreatedDate { get; set; }
    public int? RowNum { get; set; }
}

