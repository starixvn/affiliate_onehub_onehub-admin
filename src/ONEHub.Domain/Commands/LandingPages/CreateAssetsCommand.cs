using Fanex.Data;

namespace ONEHub.Domain.Commands.LandingPages;

public class CreateAssetsCommand : BaseAssetNonQueryCommand
{
    private const string SP_NAME = "OH_AssetUploader_Ins";

    public string Files { get; set; } = string.Empty;

    public string TargetCountryCode { get; set; } = string.Empty;

    [SpParam(SqlParamName = "MarketId")]
    public string LanguageCode { get; set; } = string.Empty;

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => !string.IsNullOrWhiteSpace(Files);
}

