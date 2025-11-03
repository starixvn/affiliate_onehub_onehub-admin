namespace ONEHub.Domain.Settings;

public class JwtSetting
{
    public const string SettingName = "Jwt";

    public required string SecretKey { get; set; }

    public required string Issuer { get; set; }

    public required string Audience { get; set; }

    public int AccessTokenExpirationMinutes { get; set; }

    public int RefreshTokenExpirationDays { get; set; }
}
