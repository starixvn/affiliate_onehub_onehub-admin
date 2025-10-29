namespace ONEHub.Application.DTOs.Domains;

public class InsertSpecificDomainControlParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
    public string AffUsername { get; set; } = string.Empty;
    public string AffDomain { get; set; } = string.Empty;
    public bool AffDomainIsSSL { get; set; } = true;
    public string RedirectDomain { get; set; } = string.Empty;
    public bool RedirectDomainIsSSL { get; set; } = true;
    public bool IsMobile { get; set; }
    public bool Status { get; set; } = true;
}

