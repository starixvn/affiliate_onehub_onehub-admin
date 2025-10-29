namespace ONEHub.Application.DTOs.Domains;

public class DeleteDomainControlParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
    public int DomainControlId { get; set; }
}

