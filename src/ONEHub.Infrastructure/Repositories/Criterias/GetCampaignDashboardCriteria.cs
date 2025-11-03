using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetCampaignDashboardCriteria : CriteriaBase
{
    public override string GetSettingKey() => "OH_Campaign_Dashboard_Sel";

    public override bool IsValid() => true;
}
