namespace ONEHub.Application.DTOs.Home;

public class OnlineListInfoDto
{
    public string UserName { get; set; } = string.Empty;
    public DateTime? LoggedIn { get; set; }
    public DateTime? LastRequest { get; set; }
    public string Ip { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
    public int? RowNum { get; set; }
}

