using ONEHub.Domain.Common;

namespace ONEHub.Domain.Entities.MediaGalleries;

public class BannerInfo : BaseEntity
{
    public int BannerId { get; set; }
    public string BannerName { get; set; } = string.Empty;
    public string BannerUrl { get; set; } = string.Empty;
    public string BannerType { get; set; } = string.Empty;
    public int Width { get; set; }
    public int Height { get; set; }
    public bool IsActive { get; set; }
}

