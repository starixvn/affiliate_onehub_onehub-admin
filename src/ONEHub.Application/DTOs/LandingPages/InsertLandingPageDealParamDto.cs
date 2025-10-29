namespace ONEHub.Application.DTOs.LandingPages;

public class InsertLandingPageDealParamDto
{
    public int PageId { get; set; }
    public string DealIds { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;
}

