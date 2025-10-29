using Fanex.Data;
using ONEHub.Domain.Criterias.Common;

namespace ONEHub.Domain.Criterias.LandingPages;

public class GetPageManagementCriteria : PagingCriteria
{
    private const string SP_NAME = "Aff_LandingPage_Builder_ManageSel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public string? TargetCountryCodes { get; set; }

    [SpParam(SqlParamName = "MarketIds")]
    public string? LanguageCodes { get; set; }

    public string? DealIds { get; set; }
    public string? StatusIds { get; set; }

    [SpParam(SqlParamName = "PageName")]
    public string? LandingPageName { get; set; }

    public string? CampaignName { get; set; }
}

