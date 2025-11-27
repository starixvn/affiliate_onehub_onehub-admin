namespace ONEHub.Domain.Params;

public class CreateUserParam : BaseParam
{
    public string UserName { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public bool IsAdmin { get; set; }
}
