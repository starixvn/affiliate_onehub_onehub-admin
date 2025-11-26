namespace ONEHub.Domain.Entities;

public class LinkInfo
{
    public int LinkId { get; set; }

    public string LinkName { get; set; } = string.Empty;

    public string DomainName { get; set; } = string.Empty;

    public string ShortLink { get; set; } = string.Empty;

    public string FullLink { get; set; } = string.Empty;

    public string Event { get; set; } = string.Empty;

    public string LandingPage { get; set; } = string.Empty;

    public string Group { get; set; } = string.Empty;

    public string CampaignName { get; set; } = string.Empty;

    public string ChannelName { get; set; } = string.Empty;

    public string CountryName { get; set; } = string.Empty;

    public string Agency { get; set; } = string.Empty;

    public string Language { get; set; } = string.Empty;

    public string Type { get; set; } = string.Empty;

    public string Note { get; set; } = string.Empty;

    public string IDCode { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }

    public int Click { get; set; }

    public int Registration { get; set; }

    public int Bonus { get; set; }

    public int Ftd { get; set; }

    public decimal AvgFtd { get; set; }

    public int StatusId { get; set; }

    public string StatusName { get; set; } = string.Empty;

    public int RowIdx { get; set; }
}

