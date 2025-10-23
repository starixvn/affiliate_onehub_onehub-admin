namespace ONEHub.Domain.ValueObjects;

public class TargetCountry
{
    public int CountryId { get; set; }
    public string CountryCode { get; set; } = string.Empty;
    public string CountryName { get; set; } = string.Empty;
}
