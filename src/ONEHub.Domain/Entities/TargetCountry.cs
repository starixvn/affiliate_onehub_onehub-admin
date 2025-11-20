namespace ONEHub.Domain.Entities;

public class TargetCountry
{
    public string TargetCountryCode { get; set; } = string.Empty;

    public string TargetCountryName { get; set; } = string.Empty;

    public string LanguageCode { get; set; } = string.Empty;

    public string LanguageName { get; set; } = string.Empty;

    public string ShortedLanguageCode { get; set; } = string.Empty;

    public byte Status { get; set; }
}
