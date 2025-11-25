using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias.LandingPages;

public class GetPageManagementDashboardCriteria : CriteriaBase
{
    public override string GetSettingKey() => "OH_PageBuilder_Dashboard_Sel";

    public override bool IsValid() => true;
}
