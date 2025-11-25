namespace ONEHub.Infrastructure.Repositories.Commands.LandingPages;

public class UpdateLandingPageCommand : BaseLandingPageCommand
{
    private const string SP_NAME = "OH_PageBuilder_Upd";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() =>
        PageId > 0;
}
