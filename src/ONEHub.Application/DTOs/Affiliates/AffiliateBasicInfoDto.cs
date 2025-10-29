namespace ONEHub.Application.DTOs.Affiliates;

public class AffiliateBasicInfoDto
{
    public int AffiliateId { get; set; }
    public int AffiliateCode { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Status { get; set; } = string.Empty;
}

