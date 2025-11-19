using Fanex.Data;
using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias.LandingPages;

public class GetPageManagementDashboardCriteria : CriteriaBase
{
    public string? CampaignName { get; set; }

    public string? PageName { get; set; }

    public string? StatusIds { get; set; }

    public string? TargetCountryCodes { get; set; }

    [SpParam(SqlParamName = "MarketIds")]
    public string? LanguageCodes { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public override string GetSettingKey() => "OH_PageBuilder_Dashboard_Sel";

    public override bool IsValid() => true;
}
