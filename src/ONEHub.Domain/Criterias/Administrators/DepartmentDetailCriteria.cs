using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.Administrators;

public class DepartmentDetailCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_Con_GroupInfoSel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => GroupId > 0;

    public int GroupId { get; set; }
}

