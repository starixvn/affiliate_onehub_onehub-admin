namespace ONEHub.Domain.Commands.LandingPages;

public class UpdateAssetsStatusCommand : BaseAssetNonQueryCommand
{
    private const string SP_NAME = "OH_AssetUploader_Status_Upd";

    public string MediaIds { get; set; } = string.Empty;

    public int StatusId { get; set; }

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() =>
        !string.IsNullOrWhiteSpace(MediaIds) &&
        StatusId > 0;
}

