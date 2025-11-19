namespace ONEHub.Domain.Settings;

public class ProxySetting
{
    public const string SETTING_NAME = "Proxy";

    public bool IsUseProxy { get; set; }

    public string ProxyHost { get; set; } = string.Empty;

    public int ProxyPort { get; set; }
}
