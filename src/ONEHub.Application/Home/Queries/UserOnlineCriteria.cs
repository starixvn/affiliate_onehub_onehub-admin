using Fanex.Data;
using Fanex.Data.Repository;

namespace ONEHub.Application.Home.Queries;

public class UserOnlineCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_UserOnlineList";

    public int PageIndex { get; set; }
    public int PageSize { get; set; }

    [SpParam(SqlParamName = "NRows")]
    public int TotalItem { get; set; }

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => PageIndex > 0 && PageSize > 0;
}

