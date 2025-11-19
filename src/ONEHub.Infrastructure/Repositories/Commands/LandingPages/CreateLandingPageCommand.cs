namespace ONEHub.Infrastructure.Repositories.Commands.LandingPages;

public class CreateLandingPageCommand : BaseLandingPageCommand
{
    private const string SP_NAME = "OH_PageBuilder_Ins";

    public string? PageCode { get; set; }
    public bool IsPreview { get; set; }

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() =>
        CampaignId > 0 &&
        !string.IsNullOrWhiteSpace(PageCode);
}
