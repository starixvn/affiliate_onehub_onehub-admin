namespace ONEHub.Domain.Settings;

public class AppSetting
{
    public const string SettingName = "AppSettings";

    public required string AccessKey { get; set; }

    public string[]? AllowedDomains { get; set; }
}
