namespace ONEHub.Domain.Settings;

public class SentrySetting
{
    public const string SettingName = "Sentry";

    public required string Dsn { get; set; }

    public required string Environment { get; set; }
}
