namespace ONEHub.Domain.Params;

public class GetDomainParam
{
    public string CountryCode { get; set; } = string.Empty;

    public int DomainType { get; set; }

    public int SiteId { get; set; }
}

