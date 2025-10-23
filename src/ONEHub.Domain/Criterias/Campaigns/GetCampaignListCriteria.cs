using Fanex.Data;
using ONEHub.Domain.Criterias.Common;

namespace ONEHub.Domain.Criterias.Campaigns;

public class GetCampaignListCriteria : PagingCriteria
{
    private const string SP_NAME = "Aff_LandingPage_Campaign_ManageSel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    [SpParam(SqlParamName = "CampaignSearch")]
    public string? Search { get; set; }

    public string? StatusIds { get; set; }
    public string? Description { get; set; }
    public bool IsExportExcel { get; set; }
}

