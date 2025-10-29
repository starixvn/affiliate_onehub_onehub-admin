namespace ONEHub.Domain.Entities.LandingPages;

public class ModuleMedia
{
    public int ModuleId { get; set; }

    public List<MediaItem> Files { get; set; } = [];
}

public class MediaItem
{
    public string MediaName { get; set; } = string.Empty;

    public string FileName { get; set; } = string.Empty;

    public string Dimension { get; set; } = string.Empty;
}
