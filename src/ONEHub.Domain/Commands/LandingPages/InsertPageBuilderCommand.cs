namespace ONEHub.Domain.Commands.LandingPages;

public class InsertPageBuilderCommand : BasePageBuilderCommand
{
    private const string SP_NAME = "Aff_LandingPage_Builder_Ins";

    public string PageCode { get; set; }
    public bool IsPreview { get; set; }

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() =>
        CampaignId > 0 &&
        !string.IsNullOrWhiteSpace(PageCode);
}
