namespace ONEHub.Application.DTOs.Campaigns
{
    public class CampaignDashboardDto
    {
        public int Total { get; set; }
        public int Draft { get; set; }
        public int Active { get; set; }
        public int Inactive { get; set; }
        public int Paused { get; set; }
    }
}

