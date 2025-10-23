using Fanex.Data;
using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.Members;

public class MemberDetailCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_Admin_Player_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => MemberId > 0;

    [SpParam(SqlParamName = "CustId")]
    public int MemberId { get; set; }
}

