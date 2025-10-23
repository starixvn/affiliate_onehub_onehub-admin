namespace ONEHub.Domain.Entities.UserPanels;

public class ViewLog
{
    public int LogId { get; set; }
    public string LogType { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime LogDate { get; set; }
    public string UserName { get; set; } = string.Empty;
}

