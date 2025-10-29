using Fanex.Data;
using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.Administrators;

public class AdministratorDetailCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_Con_AdminSelByCustID";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => UserId > 0;

    [SpParam(SqlParamName = "CustId")]
    public int UserId { get; set; }
}

