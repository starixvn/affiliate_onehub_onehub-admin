using System.ComponentModel.DataAnnotations;

namespace ONEHub.Domain.DTOs.LandingPages;

public class UpdateAssetsStatusRequest
{
    [Required]
    public string MediaIds { get; set; } = string.Empty;

    [Required]
    public int StatusId { get; set; }
}

