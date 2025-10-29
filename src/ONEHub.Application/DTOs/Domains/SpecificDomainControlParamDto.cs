namespace ONEHub.Application.DTOs.Domains;

public class SpecificDomainControlParamDto
{
    public string? AffUsername { get; set; }
    public string? AffDomain { get; set; }
    public string? RedirectDomain { get; set; }
    public int PageIndex { get; set; }
    public int PageSize { get; set; }
}

