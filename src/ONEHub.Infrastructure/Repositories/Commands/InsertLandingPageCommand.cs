namespace ONEHub.Infrastructure.Repositories.Commands;

public class InsertLandingPageCommand : BaseCommand
{
    private const string SP_NAME = "OH_PageBuilder_Ins";
    public override string GetSettingKey() => SP_NAME;
    public override bool IsValid() => true;
    public required string PageCode { get; set; }
    public required string PageName { get; set; }
    public bool IsPreview { get; set; }
    public int CampaignId { get; set; }
    public required string ComponentStructure { get; set; }
    public required string TargetCountryCode { get; set; }
    public required string MarketId { get; set; }
    public int StatusId { get; set; }
    public int PageId { get; set; }
}

