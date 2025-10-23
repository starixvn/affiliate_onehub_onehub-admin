using Fanex.Data;
using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.Operations;

public class GetAssignDealCriteria : CriteriaBase
{
    public int AffId { get; set; }
    public int GroupId { get; set; }

    [SpParam(Ignored = true)]
    public bool IsOnlyRevenue { get; set; } = true;

    public override string GetSettingKey() => IsOnlyRevenue ? "Aff_Admin_CommGroupNormal_Sel" : "Aff_Admin_Assign_Deal_Sel";

    public override bool IsValid() => true;
}

