namespace ONEHub.Infrastructure.Repositories.Commands.LandingPages;

public class UpdateBatchLandingPageStatusCommand : BaseCommand
{
    public string PageIds { get; set; } = string.Empty;

    public int StatusId { get; set; }

    public override string GetSettingKey() => "OH_PageBuilder_Status_Upd";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(PageIds) && StatusId >= 0;
}
