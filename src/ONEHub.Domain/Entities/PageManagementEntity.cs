namespace ONEHub.Domain.Entities;

public class PageManagementDashboard
{
    public int TotalPageBuilders { get; set; }

    public int DraftPageBuilders { get; set; }

    public int ActivePageBuilders { get; set; }

    public int InactivePageBuilders { get; set; }
}

public class LandingPage
{
    public int PageId { get; set; }
    public string CampaignCode { get; set; } = string.Empty;
    public string CampaignName { get; set; } = string.Empty;
    public string PageName { get; set; } = string.Empty;
    public string PageCode { get; set; } = string.Empty;
    public string TargetCountryCode { get; set; } = string.Empty;
    public string TargetCountryName { get; set; } = string.Empty;
    public string MarketId { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string TargetLanguageCode { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public string LastModifiedBy { get; set; } = string.Empty;
    public DateTime LastModifiedDate { get; set; }
    public byte StatusId { get; set; }
    public string Status { get; set; } = string.Empty;
    public int RowIdx { get; set; }
    public int Click { get; set; }
    public int Registration { get; set; }
    public int FTD { get; set; }
    public int Revenue { get; set; }
}
