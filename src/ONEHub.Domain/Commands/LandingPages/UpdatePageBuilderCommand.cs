namespace ONEHub.Domain.Commands.LandingPages;

public class UpdatePageBuilderCommand : BasePageBuilderCommand
{
    private const string SP_NAME = "Aff_LandingPage_Builder_Upd";

    public string PageCode { get; set; }
    public bool IsPreview { get; set; }

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => PageId > 0;
}
