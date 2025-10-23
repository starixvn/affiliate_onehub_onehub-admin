namespace ONEHub.Application.DTOs.UserPanel;

public class SubAffiliateDto
{
    public int AffId { get; set; }
    public string UserName { get; set; } = string.Empty;
    public string AffName => UserName;
    public decimal Commission { get; set; }
    public decimal SubAffCommission { get; set; }
}

