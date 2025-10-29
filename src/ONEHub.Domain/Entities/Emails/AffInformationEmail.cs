namespace ONEHub.Domain.Entities.Emails;

public class AffInformationEmail : EmailBase
{
    public string AffiliateCode { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public int AffiliateType { get; set; }
}

