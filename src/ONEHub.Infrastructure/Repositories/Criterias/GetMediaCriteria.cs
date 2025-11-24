using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetMediaCriteria : CriteriaBase
{
    private const string SP_NAME = "OH_Media_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => ModuleId > 0;

    public int ModuleId { get; set; }

    public string TargetCountryCode { get; set; } = string.Empty;

    public string MarketId { get; set; } = string.Empty;
}
