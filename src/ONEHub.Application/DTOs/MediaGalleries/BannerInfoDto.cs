namespace ONEHub.Application.DTOs.MediaGalleries;

public class BannerInfoDto
{
    public int BannerId { get; set; }
    public string FileName { get; set; } = string.Empty;
    public string Category { get; set; } = string.Empty;
    public string[] Categories => Category.Split(',');
    public string SubCategory { get; set; } = string.Empty;
    public string[] SubCategories => SubCategory.Split(',');
    public string Language { get; set; } = string.Empty;
    public string Currency { get; set; } = string.Empty;
    public string[] Currencies => Currency.Split(',');
    public string DeviceType { get; set; } = string.Empty;
    public string[] DeviceTypes => DeviceType.Split(',');
    public string AffType { get; set; } = string.Empty;
    public string[] AffTypes => AffType.Split(',');
    public string Size { get; set; } = string.Empty;
    public byte UserType { get; set; }
    public DateTime? UpdatedDate { get; set; }
}

