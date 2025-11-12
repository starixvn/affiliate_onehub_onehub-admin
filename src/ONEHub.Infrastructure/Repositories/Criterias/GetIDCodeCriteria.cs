using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias;
public class GetIDCodeCriteria : CriteriaBase
{
    public override string GetSettingKey() => "OH_IDCode_Ins";
    public override bool IsValid() => true;
}
