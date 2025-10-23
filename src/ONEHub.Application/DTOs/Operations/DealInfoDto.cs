namespace ONEHub.Application.DTOs.Operations;

public class DealInfoDto
{
    public int RowNum { get; set; }
    public int GroupId { get; set; }
    public string DealName { get; set; } = string.Empty;
    public string DealType { get; set; } = string.Empty;
    public int NoAff { get; set; }
    public string Description { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;
    public DateTime? UpdatedDate { get; set; }
    public string UpdatedDateStr => UpdatedDate?.ToString("MM/dd/yyyy HH:mm:ss") ?? string.Empty;
}

