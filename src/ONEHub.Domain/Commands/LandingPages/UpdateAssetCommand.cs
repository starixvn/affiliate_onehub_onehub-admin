namespace ONEHub.Domain.Commands.LandingPages;

public class UpdateAssetCommand : CreateAssetsCommand
{
    private const string SP_NAME = "OH_AssetUploader_Upd";

    public int ModuleId { get; set; }

    public int MediaId { get; set; }

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() =>
        ModuleId > 0 && MediaId > 0;
}

