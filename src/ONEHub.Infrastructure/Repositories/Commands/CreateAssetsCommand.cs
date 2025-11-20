using Fanex.Data;

namespace ONEHub.Infrastructure.Repositories.Commands;

public class CreateAssetsCommand : BaseCommand
{
    public string Files { get; set; } = string.Empty;

    public string TargetCountryCode { get; set; } = string.Empty;

    [SpParam(SqlParamName = "MarketId")]
    public string LanguageCode { get; set; } = string.Empty;

    public override string GetSettingKey() => "OH_AssetUploader_Ins";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(Files);
}
