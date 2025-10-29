using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.Customer;

public class UpdateStatusParamDto
{
    [Range(Validation.MinId, Validation.MaxId)]
    public int AffId { get; set; }

    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    [Required]
    public string Status { get; set; } = string.Empty;
}

