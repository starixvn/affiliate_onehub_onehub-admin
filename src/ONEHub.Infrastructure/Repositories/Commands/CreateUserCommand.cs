namespace ONEHub.Infrastructure.Repositories.Commands;

public class CreateUserCommand : BaseCommand
{
    public string UserName { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public bool IsAdmin { get; set; }

    public override string GetSettingKey() => "OH_UserInfo_Ins";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(UserName) && !string.IsNullOrWhiteSpace(PasswordHash);
}
