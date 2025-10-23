namespace ONEHub.Domain.Entities.Domains;

public class AffSubDomainInfo
{
    public string AffiliateDomain { get; set; } = string.Empty;
    public string AffiliateSubDomain => AffiliateDomain?.ToLowerInvariant().Split('.').FirstOrDefault() ?? string.Empty;
}

