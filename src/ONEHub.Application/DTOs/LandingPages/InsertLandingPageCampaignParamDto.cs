namespace ONEHub.Application.DTOs.LandingPages;

public class InsertLandingPageCampaignParamDto
{
    public int PageId { get; set; }
    public int CampaignId { get; set; }
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
}

