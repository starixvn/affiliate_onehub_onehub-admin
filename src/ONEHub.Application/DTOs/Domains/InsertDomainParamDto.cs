namespace ONEHub.Application.DTOs.Domains;

public class InsertDomainParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
    public string DomainName { get; set; } = string.Empty;
    public string BlockTargetCountry { get; set; } = string.Empty;
    public bool IsSSL { get; set; } = true;
    public bool IsAffDomain { get; set; }
}

