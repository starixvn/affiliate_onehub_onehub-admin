namespace ONEHub.Domain.Settings;

public class ExternalAuthSetting
{
    public const string SettingName = "ExternalAuth";

    public required string ValidationApiUrl { get; set; }

    public string? ProxyUrl { get; set; }

    public int TimeoutSeconds { get; set; } = 30;
}
