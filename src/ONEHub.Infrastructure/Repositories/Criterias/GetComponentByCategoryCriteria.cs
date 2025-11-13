using Fanex.Data;
using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetComponentByCategoryCriteria : CriteriaBase
{
    private const string SP_NAME = "OH_Component_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => CategoryId > 0;

    [SpParam(SqlParamName = "ComponentTypeId")]
    public int CategoryId { get; set; }

    public int? ComponentId { get; set; }
}
