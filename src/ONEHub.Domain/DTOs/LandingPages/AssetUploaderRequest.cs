namespace ONEHub.Domain.DTOs.LandingPages;

public class AssetUploaderRequest
{
    public int PageIndex { get; set; }
    public int PageSize { get; set; } = 10;
    public string ModuleIds { get; set; } = string.Empty;
    public string TargetCountrycodes { get; set; } = string.Empty;
    public string LanguageCodes { get; set; } = string.Empty;
    public int Status { get; set; }
    public int MediaId { get; set; }
    public string MediaName { get; set; } = string.Empty;
}

