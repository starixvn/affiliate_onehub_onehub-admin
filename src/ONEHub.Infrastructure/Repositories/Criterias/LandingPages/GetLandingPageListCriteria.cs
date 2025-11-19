using Fanex.Data;

namespace ONEHub.Infrastructure.Repositories.Criterias.LandingPages;

public class GetLandingPageListCriteria : PagingCriteria
{
    public string? TargetCountryCodes { get; set; }

    [SpParam(SqlParamName = "MarketIds")]
    public string? LanguageCodes { get; set; }

    public string? StatusIds { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }

    public string? PageName { get; set; }

    public string? CampaignName { get; set; }

    public bool? IsExportExcel { get; set; }

    public override string GetSettingKey() => "OH_PageBuilder_ManageSel";

    public override bool IsValid() => true;
}
