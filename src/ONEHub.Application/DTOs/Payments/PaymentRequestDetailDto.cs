namespace ONEHub.Application.DTOs.Payments;

public class PaymentRequestDetailDto : PaymentRequestDto
{
    public int AffId { get; set; }
    public string Email { get; set; } = string.Empty;
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PaymentMethod { get; set; } = string.Empty;
    public string PlayerUsername { get; set; } = string.Empty;
    public string AdminDesc { get; set; } = string.Empty;
    public string AffDesc { get; set; } = string.Empty;
    public new string TransDateText => TransDate.ToString("MM/dd/yyyy HH:mm:ss");
    public new string CompletedDateText => CompletedDate.ToString("MM/dd/yyyy HH:mm:ss");
    public decimal TransAmount { get; set; }
    public string TransCurrencyCode { get; set; } = string.Empty;
    public decimal OriginalTransAmount { get; set; }
}

