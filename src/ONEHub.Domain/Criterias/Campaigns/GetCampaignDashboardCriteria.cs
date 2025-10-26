using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.Campaigns;

public class GetCampaignDashboardCriteria : CriteriaBase
{
    private const string SP_NAME = "OH_Campaign_Dashboard_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;
}

