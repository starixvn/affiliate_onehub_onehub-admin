using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.Customer;

public class UpdateAffTypeParamDto
{
    [Range(Validation.MinId, Validation.MaxId)]
    public int AffId { get; set; }

    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    [Range(Validation.MinAffType, Validation.MaxAffType, ErrorMessage = "AffType is incorrect!")]
    public int AffType { get; set; }
}

