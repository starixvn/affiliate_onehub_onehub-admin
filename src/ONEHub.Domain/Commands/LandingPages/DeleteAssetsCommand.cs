namespace ONEHub.Domain.Commands.LandingPages;

public class DeleteAssetsCommand : BaseAssetNonQueryCommand
{
    private const string SP_NAME = "OH_AssetUploader_Del";

    public string MediaIds { get; set; } = string.Empty;

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => !string.IsNullOrWhiteSpace(MediaIds);
}

