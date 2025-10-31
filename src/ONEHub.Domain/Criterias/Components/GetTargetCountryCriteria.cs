using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.Components;

public class GetTargetCountryCriteria : CriteriaBase
{
    private const string SP_NAME = "OH_TargetCountry_Sel";

    public override string GetSettingKey() => SP_NAME;
    public override bool IsValid() => true;

    public string TargetCountryCode { get; set; } = string.Empty;
    public bool IsDefault { get; set; }
}

