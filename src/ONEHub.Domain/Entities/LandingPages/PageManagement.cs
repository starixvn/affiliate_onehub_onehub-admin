namespace ONEHub.Domain.Entities.LandingPages;

public class PageManagement
{
    public int PageId { get; set; }
    public string PageName { get; set; } = string.Empty;
    public string PageCode { get; set; } = string.Empty;
    public string TargetCountryName { get; set; } = string.Empty;
    public string Language { get; set; } = string.Empty;
    public string TargetLanguageCode { get; set; } = string.Empty;
    public string Deals { get; set; } = string.Empty;
    public int NoOfDeals { get; set; }
    public byte StatusId { get; set; }
    public string CampaignCode { get; set; } = string.Empty;
    public string CampaignName { get; set; } = string.Empty;
    public string CreatedDate { get; set; } = string.Empty;
    public string CreatedBy { get; set; } = string.Empty;
    public string LastModifiedBy { get; set; } = string.Empty;
    public string LastModifiedDate { get; set; } = string.Empty;
}
