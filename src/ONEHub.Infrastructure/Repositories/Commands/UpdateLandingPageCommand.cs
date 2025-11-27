namespace ONEHub.Infrastructure.Repositories.Commands;

public class UpdateLandingPageCommand : BaseCommand
{
    private const string SP_NAME = "OH_PageBuilder_Upd";
    public int PageId { get; set; }
    public required string PageName { get; set; }
    public int CampaignId { get; set; }
    public required string ComponentStructure { get; set; }
    public required string TargetCountryCode { get; set; }
    public required string MarketId { get; set; }
    public int StatusId { get; set; }
    public bool IsUpdStatus { get; set; }
    public override string GetSettingKey() => SP_NAME;
    public override bool IsValid() => true;
}

