using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetDomainCriteria : CriteriaBase
{
    private const string SP_NAME = "OH_Domain_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => !string.IsNullOrEmpty(CountryCode);

    public string CountryCode { get; set; } = string.Empty;

    public int DomainType { get; set; }

    public int SiteId { get; set; }
}

