namespace ONEHub.Domain.Entities;

public class AssetDetail
{
    public int MediaId { get; set; }

    public string MediaName { get; set; } = string.Empty;

    public string FileName { get; set; } = string.Empty;

    public int ModuleId { get; set; }

    public string ModuleName { get; set; } = string.Empty;

    public string Dimension { get; set; } = string.Empty;

    public int StatusId { get; set; }

    public string TargetCountryCode { get; set; } = string.Empty;

    public string TargetCountryName { get; set; } = string.Empty;

    public string LanguageCode { get; set; } = string.Empty;

    public string MarketId { get; set; } = string.Empty;

    public string MarketName { get; set; } = string.Empty;

    public string CreatedDate { get; set; } = string.Empty;

    public string CreatedBy { get; set; } = string.Empty;

    public string UpdatedDate { get; set; } = string.Empty;

    public string UpdatedBy { get; set; } = string.Empty;

    public bool IsMediaIdInUse { get; set; }
}
