using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.Common;

public class SimpleCriteria : CriteriaBase
{
    private readonly string _spName;

    public SimpleCriteria(string spName)
    {
        _spName = spName;
    }

    public override string GetSettingKey() => _spName;

    public override bool IsValid() => !string.IsNullOrWhiteSpace(_spName);
}

