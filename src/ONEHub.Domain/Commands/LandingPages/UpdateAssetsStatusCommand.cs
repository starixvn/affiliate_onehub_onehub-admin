namespace ONEHub.Domain.Commands.LandingPages;

public class UpdateAssetsStatusCommand : BaseAssetNonQueryCommand
{
    private const string SP_NAME = "Aff_LandingPage_AssetUploader_Status_Upd";

    public string MediaIds { get; set; } = string.Empty;
    public int StatusId { get; set; }

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() =>
        !string.IsNullOrWhiteSpace(MediaIds) &&
        StatusId > 0;
}

