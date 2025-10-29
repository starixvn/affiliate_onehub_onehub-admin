using ONEHub.Domain.Entities.Common;

namespace ONEHub.Domain.Entities.Domains;

public class TargetCountryByDomain : TargetCountry
{
    public bool IsUsedDomainControl { get; set; }
}

