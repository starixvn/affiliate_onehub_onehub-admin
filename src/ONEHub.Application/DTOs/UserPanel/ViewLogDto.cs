namespace ONEHub.Application.DTOs.UserPanel;

public class ViewLogDto
{
    public int LogId { get; set; }
    public DateTime Date { get; set; }
    public string UpdatedName { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Action { get; set; } = string.Empty;
    public string Ip { get; set; } = string.Empty;
}

