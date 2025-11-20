using Fanex.Data;

namespace ONEHub.Infrastructure.Repositories.Commands;

public class UpdateAssetCommand : BaseCommand
{
    public int MediaId { get; set; }

    public int ModuleId { get; set; }

    public string TargetCountryCode { get; set; } = string.Empty;

    [SpParam(SqlParamName = "MarketId")]
    public string LanguageCode { get; set; } = string.Empty;

    public string Files { get; set; } = string.Empty;

    public override string GetSettingKey() => "OH_AssetUploader_Upd";

    public override bool IsValid() => MediaId > 0 && ModuleId > 0;
}
