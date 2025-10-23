using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.MediaGalleries;

public class DeleteLandingPageParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    [Required(ErrorMessage = "Please select the items to delete")]
    public string PageIds { get; set; } = string.Empty;
}

