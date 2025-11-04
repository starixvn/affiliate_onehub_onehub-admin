using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.LandingPages;

public class GetLandingPageDropdownCriteria : CriteriaBase
{
    private const string SP_NAME = "OH_LandingPage_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;
}

