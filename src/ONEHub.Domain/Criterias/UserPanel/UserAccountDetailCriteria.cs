using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.UserPanel;

public class UserAccountDetailCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_Admin_AffiliateInfo_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => AffId > 0;

    public int AffId { get; set; }
}

