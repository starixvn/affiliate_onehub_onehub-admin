using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.UserPanel;

public class LandingPageStatisticsParamDto
{
    [Range(Validation.MinId, Validation.MaxId)]
    public int AffId { get; set; }

    public string SelectedPage { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;

    [Required]
    public DateTime? FromDate { get; set; }

    [Required]
    public DateTime? ToDate { get; set; }

    public short DeviceType { get; set; }
}

