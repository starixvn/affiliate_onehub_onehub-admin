using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias.LandingPages;

public class GetLandingPageStatusCriteria : CriteriaBase
{
    public override string GetSettingKey() => "OH_PageBuilder_Status_Sel";

    public override bool IsValid() => true;
}
