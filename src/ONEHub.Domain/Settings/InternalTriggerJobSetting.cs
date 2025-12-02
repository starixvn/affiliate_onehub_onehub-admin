namespace ONEHub.Domain.Settings;

public class InternalTriggerJobSetting
{
    public const string SETTING_NAME = "InternalTriggerJob";

    public string Host { get; set; } = string.Empty;

    public string ProxyUrl { get; set; } = string.Empty;

    public int TimeoutSeconds { get; set; } = 30;
}

