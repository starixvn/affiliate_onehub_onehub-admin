using ONEHub.Application.DTOs.Common;

namespace ONEHub.Application.DTOs.Campaigns
{
    public class InsertCampaignParamDto : UserInfoParamDto
    {
        public string CampaignName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int StatusId { get; set; }
    }
}

