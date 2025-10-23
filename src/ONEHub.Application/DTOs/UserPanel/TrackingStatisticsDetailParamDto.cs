using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.UserPanel;

public class TrackingStatisticsDetailParamDto : TrackingStatisticsParamDto
{
    [Required]
    public DateTime SelectedMonth { get; set; }
}

