using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.Home;

public class GeneralInfoCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_Admin_GeneralInfo_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;
}

