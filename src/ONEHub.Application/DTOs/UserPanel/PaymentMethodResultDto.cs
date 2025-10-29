namespace ONEHub.Application.DTOs.UserPanel;

public class PaymentMethodResultDto
{
    public IEnumerable<PaymentMethodInfoDto> PaymentMethods { get; set; } = Array.Empty<PaymentMethodInfoDto>();
    public decimal MinAmount { get; set; }
}

