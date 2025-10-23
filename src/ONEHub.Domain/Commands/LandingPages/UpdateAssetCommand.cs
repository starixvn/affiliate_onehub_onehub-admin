namespace ONEHub.Domain.Commands.LandingPages;

public class UpdateAssetCommand : UploadAssetsCommand
{
    private const string SP_NAME = "Aff_LandingPage_AssetUploader_Upd";

    public int MediaId { get; set; }

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() =>
        ModuleId > 0 && MediaId > 0;
}

