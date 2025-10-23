using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.Auth;

public class UserPermissionCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_Admin_PolicySel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => UserId > 0;

    public int UserId { get; set; }
}

