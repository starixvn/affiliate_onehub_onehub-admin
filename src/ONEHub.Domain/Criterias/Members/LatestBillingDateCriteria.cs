using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.Members;

public class LatestBillingDateCriteria : CriteriaBase
{
    private const string SP_NAME = "Task_Aff_GetSetting";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public string SName { get; } = "AFF_CommissionDate";
}

