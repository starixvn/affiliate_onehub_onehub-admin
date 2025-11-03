using Fanex.Data;
using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public abstract class PagingCriteria : CriteriaBase
{
    public int PageIndex { get; set; }

    public int PageSize { get; set; }

    [SpParam(SqlParamName = "NRows")]
    public int TotalItem { get; set; }
}
