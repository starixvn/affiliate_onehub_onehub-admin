namespace ONEHub.Domain.Entities;

public class LinkInfo
{
    public int LinkId { get; set; }

    public string LinkName { get; set; } = string.Empty;

    public string DomainName { get; set; } = string.Empty;

    public string ShortLink { get; set; } = string.Empty;

    public string CampaignName { get; set; } = string.Empty;

    public string CountryName { get; set; } = string.Empty;

    public string ChannelName { get; set; } = string.Empty;

    public string IDCode { get; set; } = string.Empty;

    public DateTime CreatedDate { get; set; }

    public int Click { get; set; }

    public int Registration { get; set; }

    public int Ftd { get; set; }

    public decimal AvgFtdAmount { get; set; }

    public int StatusId { get; set; }

    public string StatusName { get; set; } = string.Empty;

    public int RowIdx { get; set; }
}

