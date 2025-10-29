using Fanex.Data;
using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.LandingPages;

public class GetMediaSourceCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_LandingPage_Media_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public int ModuleId { get; set; }
    public string TargetCountryCode { get; set; }

    [SpParam(SqlParamName = "MarketId")]
    public string LanguageCode { get; set; }
}
