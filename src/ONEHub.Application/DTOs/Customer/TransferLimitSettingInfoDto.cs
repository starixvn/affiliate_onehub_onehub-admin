using ONEHub.Domain.Constants;

namespace ONEHub.Application.DTOs.Customer;

public class TransferLimitSettingInfoDto
{
    public int PlayerCustId { get; set; }
    public string PlayerUsername { get; set; } = string.Empty;
    public string PlayerCurrency { get; set; } = string.Empty;
    public decimal TransferLimit { get; set; }
    public bool IsDisabledTransfer { get; set; }
    public bool IsUnlimited => TransferLimit == Money.AllowedMaxValue;
}

