using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.Customer;

public class TransferLimitSettingParamDto
{
    [Range(Validation.MinId, Validation.MaxId)]
    public int AffId { get; set; }

    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    [Range(0, Money.AllowedMaxValue, ErrorMessage = "Limit exceeds the allowable range.")]
    [RegularExpression("^\\d*$", ErrorMessage = "Limit must be a whole positive number.")]
    public decimal TransferLimit { get; set; }

    public bool DisabledTransfer { get; set; }
}

