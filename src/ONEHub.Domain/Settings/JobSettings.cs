namespace ONEHub.Domain.Settings;

public class JobSettings
{
    public const string SettingName = "JobSettings";

    public int GoogleSheetsIntervalMinutes { get; set; } = 1;
}
