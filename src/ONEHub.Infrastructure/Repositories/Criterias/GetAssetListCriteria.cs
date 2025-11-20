using Fanex.Data;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetAssetListCriteria : PagingCriteria
{
    private const string SP_NAME = "OH_AssetUploader_ManageSel";

    public GetAssetListCriteria()
    {
        PageIndex = 1;
        PageSize = 20;
    }

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public string? MediaName { get; set; }

    public string? ModuleIds { get; set; }

    public string? TargetCountryCodes { get; set; } = string.Empty;

    [SpParam(SqlParamName = "MarketIds")]
    public string? LanguageCodes { get; set; } = string.Empty;

    [SpParam(SqlParamName = "StatusId")]
    public int Status { get; set; }

    public int MediaId { get; set; }

    public int UserId { get; set; }

    public string FunctionName { get; set; } = string.Empty;
}
