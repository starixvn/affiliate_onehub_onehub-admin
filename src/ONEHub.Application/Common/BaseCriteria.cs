using Fanex.Data.Repository;

namespace ONEHub.Application.Common;

public abstract class BaseCriteria : CriteriaBase
{
    public abstract override string GetSettingKey();
    public abstract override bool IsValid();
}

