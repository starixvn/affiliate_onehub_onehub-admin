namespace ONEHub.Application.DTOs.Members;

public class PlayerActionInfoDto
{
    public string UserName { get; set; } = string.Empty;
    public string AffUserName { get; set; } = string.Empty;
    public bool IsRemoved { get; set; }
    public DateTime? FromDate { get; set; }
    public DateTime? LastAction { get; set; }
}

