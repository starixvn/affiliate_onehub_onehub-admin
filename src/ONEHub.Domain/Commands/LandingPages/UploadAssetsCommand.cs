using Fanex.Data;

namespace ONEHub.Domain.Commands.LandingPages;

public class UploadAssetsCommand : BaseAssetNonQueryCommand
{
    private const string SP_NAME = "Aff_LandingPage_AssetUploader_Ins";

    public string Files { get; set; } = string.Empty;
    public int ModuleId { get; set; }
    public string TargetCountryCode { get; set; } = string.Empty;
    [SpParam(SqlParamName = "MarketId")]
    public string LanguageCode { get; set; } = string.Empty;

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() =>
        ModuleId > 0 &&
        !string.IsNullOrWhiteSpace(Files);
}

