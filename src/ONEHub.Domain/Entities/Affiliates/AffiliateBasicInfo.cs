namespace ONEHub.Domain.Entities.Affiliates;

public class AffiliateBasicInfo
{
    public int AffiliateId { get; set; }
    public string AffiliateCode { get; set; } = string.Empty;
    public string ParentAffiliateName { get; set; } = string.Empty;
    public int GroupId { get; set; }
    public string AffiliateName { get; set; } = string.Empty;
    public string UserName => AffiliateName;
    public int AffiliateType { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Phone { get; set; } = string.Empty;
    public string ContactNumber => Phone;
    public string Email { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public bool MailOption { get; set; }
    public string PreferredLanguage { get; set; } = string.Empty;
    public string PlayerUsername { get; set; } = string.Empty;
    public int PlayerCustomerId { get; set; }
    public bool IsUsingPrivateCommissionGroup { get; set; }
    public int AffiliateCategoryId { get; set; }
    public int GroupTypeId { get; set; }
}

