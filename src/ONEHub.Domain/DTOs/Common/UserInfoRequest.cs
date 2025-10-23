namespace ONEHub.Domain.DTOs.Common;

public class UserInfoRequest
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
}

