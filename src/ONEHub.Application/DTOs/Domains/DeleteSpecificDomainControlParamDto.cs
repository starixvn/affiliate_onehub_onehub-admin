namespace ONEHub.Application.DTOs.Domains;

public class DeleteSpecificDomainControlParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
    public int SpecificDomainControlId { get; set; }
}

