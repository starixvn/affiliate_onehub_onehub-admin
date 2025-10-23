using System.ComponentModel.DataAnnotations;

namespace ONEHub.Application.DTOs.MediaGalleries;

public class InsertUpdateMultipleBannersParamDto
{
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
    public int BannerId { get; set; }
    public string Files { get; set; } = string.Empty;
    public List<string> FilePaths { get; set; } = new();

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string InputFileNames { get; set; } = string.Empty;

    [Required]
    public string Categories { get; set; } = string.Empty;

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string SubCategories { get; set; } = string.Empty;

    [Required]
    public string Language { get; set; } = string.Empty;

    [DisplayFormat(ConvertEmptyStringToNull = false)]
    public string Currencies { get; set; } = string.Empty;

    public List<string> Sizes { get; set; } = new();

    [Required]
    public string AffTypes { get; set; } = string.Empty;

    [Required]
    public string DeviceTypes { get; set; } = string.Empty;

    public byte UserType { get; set; }
}

