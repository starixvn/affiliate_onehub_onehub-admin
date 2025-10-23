using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.UserPanel;

public class TrackingStatisticsParamDto
{
    [Range(Validation.MinId, Validation.MaxId)]
    public int AffId { get; set; }

    public string TrackingCode { get; set; } = string.Empty;
}

