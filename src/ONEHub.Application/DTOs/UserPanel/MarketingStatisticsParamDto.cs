using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.UserPanel;

public class MarketingStatisticsParamDto
{
    [Range(Validation.MinId, Validation.MaxId)]
    public int AffId { get; set; }

    [Required]
    public DateTime FromDate { get; set; }

    [Required]
    public DateTime ToDate { get; set; }

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string LanguageCodes { get; set; } = string.Empty;

    public bool IncludedInActive { get; set; }
}

