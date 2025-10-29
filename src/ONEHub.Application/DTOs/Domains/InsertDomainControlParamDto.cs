namespace ONEHub.Application.DTOs.Domains;

public class InsertDomainControlParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
    public string TargetCountryCode { get; set; } = string.Empty;
    public int AffDomainId { get; set; }
    public int RedirectDomainId { get; set; }
    public bool IsMobile { get; set; }
    public bool IsExcluded { get; set; }
    public string DealIds { get; set; } = string.Empty;
    public bool IsUsed { get; set; } = true;
}

