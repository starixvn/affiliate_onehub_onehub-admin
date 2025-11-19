using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetLandingPageDropdownCriteria : CriteriaBase
{
    public override string GetSettingKey() => "OH_LandingPage_Sel";

    public override bool IsValid() => true;
}

