using System.Text.Json.Serialization;

namespace ONEHub.Domain.Entities;

public class GSheetsDomain
{
    [JsonPropertyName("DmN")]
    public string DmN { get; set; } = string.Empty;

    [JsonPropertyName("Nt")]
    public string Nt { get; set; } = string.Empty;

    [JsonPropertyName("Dts")]
    public List<GSheetsCountry> Dts { get; set; } = [];
}

public class GSheetsCountry
{
    [JsonPropertyName("CC")]
    public string CC { get; set; } = string.Empty;

    [JsonPropertyName("Sc")]
    public double Sc { get; set; }
}
