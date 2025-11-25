namespace ONEHub.Infrastructure.Repositories.Commands.LandingPages;

public class DeleteBatchLandingPageCommand : BaseCommand
{
    public string PageIds { get; set; } = string.Empty;

    public override string GetSettingKey() => "OH_PageBuilder_Del";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(PageIds);
}
