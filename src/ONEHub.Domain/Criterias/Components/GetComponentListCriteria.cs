using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.Components;

public class GetComponentListCriteria : CriteriaBase
{
    private const string SP_NAME = "OH_Component_Sel";

    public override string GetSettingKey() => SP_NAME;
    public override bool IsValid() => ComponentTypeId > 0;

    public int ComponentTypeId { get; set; }
    public int? ComponentId { get; set; }
}

