namespace ONEHub.Application.DTOs.Payments;

public class PaymentRequestUpdateParamDto
{
    public long TransId { get; set; }
    public int AffId { get; set; }
    public bool IsApproved { get; set; }
    public string AdminDescription { get; set; } = string.Empty;
    public string UpdatedBy { get; set; } = string.Empty;
    public string Ip { get; set; } = string.Empty;
}

