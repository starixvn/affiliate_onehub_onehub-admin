namespace ONEHub.Application.DTOs.MediaGalleries;

public class LandingPageDto
{
    public int PageId { get; set; }
    public string PageName { get; set; } = string.Empty;
    public string PageCode { get; set; } = string.Empty;
    public bool IsExcluded { get; set; }
    public string DealIds { get; set; } = string.Empty;
    public bool IsMobile { get; set; }
    public string BlockTargetCountry { get; set; } = string.Empty;
    public bool CanEdit { get; set; }
    public bool IsDefault { get; set; }
    public byte StatusId { get; set; }
}

