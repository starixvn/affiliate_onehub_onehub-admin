namespace ONEHub.Domain.Entities.Apis;

public class ApiAffiliateInfo
{
    public int CustomerId { get; set; }
    public int SiteId { get; set; }
    public int AffiliateId { get; set; }
    public string AffiliateName { get; set; } = string.Empty;
    public string ParentAffiliate { get; set; } = string.Empty;
    public string AffiliateCode { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string ContactNumber { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

