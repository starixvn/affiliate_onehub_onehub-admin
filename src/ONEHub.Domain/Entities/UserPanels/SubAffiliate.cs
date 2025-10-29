namespace ONEHub.Domain.Entities.UserPanels;

public class SubAffiliate
{
    public int AffiliateId { get; set; }
    public string AffiliateUsername { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
    public DateTime RegistrationDate { get; set; }
    public int MemberCount { get; set; }
}

