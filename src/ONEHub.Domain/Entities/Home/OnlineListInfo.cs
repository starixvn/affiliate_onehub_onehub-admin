namespace ONEHub.Domain.Entities.Home;

public class OnlineListInfo
{
    public string UserName { get; set; } = string.Empty;
    public DateTime? LoggedIn { get; set; }
    public DateTime? LastRequest { get; set; }
    public string IpAddress { get; set; } = string.Empty;
    public string Role { get; set; } = string.Empty;
}

