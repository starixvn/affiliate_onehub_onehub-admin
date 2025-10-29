namespace ONEHub.Domain.Entities.Emails;

public class AffiliateApprovedEmail : EmailBase
{
    public string AffiliateUsername { get; set; } = string.Empty;
    public string AffiliateName { get; set; } = string.Empty;
    public string TemporaryPassword { get; set; } = string.Empty;
}

