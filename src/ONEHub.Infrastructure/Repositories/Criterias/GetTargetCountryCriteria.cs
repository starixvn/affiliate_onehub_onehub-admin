using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetTargetCountryCriteria(bool isDefault = true, string targetCountryCode = "") : CriteriaBase
{
    private const string SP_NAME = "OH_TargetCountry_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public string TargetCountryCode { get; set; } = targetCountryCode;

    public bool IsDefault { get; set; } = isDefault;
}

