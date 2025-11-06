using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetComponentSummaryCriteria : CriteriaBase
{
    public override string GetSettingKey() => "OH_Component_Dashboard_Sel";

    public override bool IsValid() => true;
}
