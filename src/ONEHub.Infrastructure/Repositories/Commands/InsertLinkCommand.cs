namespace ONEHub.Infrastructure.Repositories.Commands;

public class InsertLinkCommand : BaseCommand
{
    private const string SP_NAME = "OH_LinkGenerator_Ins";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public string LinkName { get; set; } = string.Empty;

    public string? IDCode { get; set; }

    public int CampaignId { get; set; }

    public string CountryCode { get; set; } = string.Empty;

    public string MarketId { get; set; } = string.Empty;

    public string EventIds { get; set; } = string.Empty;

    public int GroupId { get; set; }

    public int ChannelId { get; set; }

    public int AgencyId { get; set; }

    public int TypeId { get; set; }

    public string PageCode { get; set; } = string.Empty;

    public int PageType { get; set; }

    public string DomainName { get; set; } = string.Empty;

    public string DomainNote { get; set; } = string.Empty;

    public string Note { get; set; } = string.Empty;

    public string ShortPath { get; set; } = string.Empty;

    public string ShortDomain { get; set; } = string.Empty;

    public string FullLink { get; set; } = string.Empty;

    public int SiteId { get; set; } = 101;

    public int StatusId { get; set; } = 1;
}

