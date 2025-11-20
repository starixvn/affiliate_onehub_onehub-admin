using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias.LandingPages;
public class GetStatusCriteria: CriteriaBase
{
    public override string GetSettingKey() => "OH_LandingPage_Status_Sel";

    public override bool IsValid() => true;
}
