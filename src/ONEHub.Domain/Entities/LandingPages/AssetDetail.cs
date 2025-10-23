using ONEHub.Domain.Common;

namespace ONEHub.Domain.Entities.LandingPages;

public class AssetDetail : BaseEntity
{
    public int MediaId { get; set; }
    public string MediaName { get; set; } = string.Empty;
    public string FileName { get; set; } = string.Empty;
    public int ModuleId { get; set; }
    public string ModuleName { get; set; } = string.Empty;
    public string Dimension { get; set; } = string.Empty;
    public byte StatusId { get; set; }
    public string TargetCountryCode { get; set; } = string.Empty;
    public string TargetCountryName { get; set; } = string.Empty;
    public string MarketId { get; set; } = string.Empty;
    public string MarketName { get; set; } = string.Empty;
    public new DateTime CreatedDate { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime UpdatedDate { get; set; }
    public string UpdatedBy { get; set; } = string.Empty;
    public bool IsMediaIdInUse { get; set; }
}

