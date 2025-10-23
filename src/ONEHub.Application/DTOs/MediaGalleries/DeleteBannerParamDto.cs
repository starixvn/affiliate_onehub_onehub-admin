using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.MediaGalleries;

public class DeleteBannerParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    [Required(ErrorMessage = "Please select banners to delete")]
    public string BannerIdList { get; set; } = string.Empty;

    public byte UserType { get; set; }
}

