using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.Common;

public class TargetCountryCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_TargetCountry_Sel";

    public TargetCountryCriteria(bool isDefault = true, string targetCountryCode = "")
    {
        IsDefault = isDefault;
        TargetCountryCode = targetCountryCode;
    }

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public string TargetCountryCode { get; set; }
    public bool IsDefault { get; set; }
}

