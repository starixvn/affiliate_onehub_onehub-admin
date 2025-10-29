namespace ONEHub.Domain.Entities.UserPanels;

public class TrackingInfo
{
    public string TrackingCode { get; set; } = string.Empty;
    public string LandingPage { get; set; } = string.Empty;
    public DateTime CreatedDate { get; set; }
    public bool IsActive { get; set; }
}

