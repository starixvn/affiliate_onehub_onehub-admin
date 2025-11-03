namespace ONEHub.Domain.Settings;

public class RedisSetting
{
    public const string SettingName = "Redis";

    public required string ConnectionString { get; set; }

    public required string ApplicationName { get; set; }
}
