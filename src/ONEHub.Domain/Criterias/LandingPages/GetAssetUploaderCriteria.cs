using Fanex.Data;
using ONEHub.Domain.Criterias.Common;

namespace ONEHub.Domain.Criterias.LandingPages;

public class GetAssetUploaderCriteria : PagingCriteria
{
    private const string SP_NAME = "Aff_LandingPage_AssetUploader_ManageSel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public int UserId { get; set; }
    [SpParam(SqlParamName = "StatusId")]
    public int Status { get; set; }
    public string ModuleIds { get; set; } = string.Empty;
    public string TargetCountrycodes { get; set; } = string.Empty;
    [SpParam(SqlParamName = "MarketIds")]
    public string LanguageCodes { get; set; } = string.Empty;
    public string FunctionName { get; set; } = string.Empty;
    public int MediaId { get; set; }
    public string MediaName { get; set; } = string.Empty;
}

