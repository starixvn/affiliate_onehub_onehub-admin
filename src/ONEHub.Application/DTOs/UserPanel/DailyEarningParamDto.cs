using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.UserPanel;

public class DailyEarningParamDto
{
    [Range(Validation.MinId, Validation.MaxId)]
    public int AffId { get; set; }

    public byte ProductId { get; set; }

    [Required]
    public DateTime? MonthDate { get; set; }

    public int BaseCurrencyId { get; set; }
    public string CurrencyIds { get; set; } = string.Empty;
}

