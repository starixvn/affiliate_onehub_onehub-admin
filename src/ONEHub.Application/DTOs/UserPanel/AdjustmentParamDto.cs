using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.UserPanel;

public class AdjustmentParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    [Range(Validation.MinId, Validation.MaxId)]
    public int AffId { get; set; }

    public decimal Amount { get; set; }
    public string Description { get; set; } = string.Empty;
}

