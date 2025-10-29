using System.ComponentModel.DataAnnotations;

namespace ONEHub.Domain.DTOs.LandingPages;

public class DeleteAssetsRequest
{
    [Required]
    public string MediaIds { get; set; } = string.Empty;
}

