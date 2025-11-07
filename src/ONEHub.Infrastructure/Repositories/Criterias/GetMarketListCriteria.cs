using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetMarketListCriteria : CriteriaBase
{
    private const string SP_NAME = "OH_Market_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;
}
