using ONEHub.Domain.Criterias.Common;

namespace ONEHub.Domain.Criterias.Domains;

public class SpecificDomainControlCriteria : PagingCriteria
{
    private const string SP_NAME = "Aff_Admin_SpecificDomainControl_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public string AffUsername { get; set; } = string.Empty;
    public string AffDomain { get; set; } = string.Empty;
    public string RedirectDomain { get; set; } = string.Empty;
}

