namespace ONEHub.Domain.Entities;

public class User
{
    public int UserId { get; set; }

    public string UserName { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string Avatar { get; set; } = string.Empty;

    public bool IsAdmin { get; set; }

    public string Roles { get; set; } = string.Empty;
}
