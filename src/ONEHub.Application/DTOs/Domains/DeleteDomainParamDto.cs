namespace ONEHub.Application.DTOs.Domains;

public class DeleteDomainParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
    public int DomainId { get; set; }
    public bool IsAffDomain { get; set; }
}

