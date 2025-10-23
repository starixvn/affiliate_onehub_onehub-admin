using ONEHub.Application.DTOs.Common;

namespace ONEHub.Application.DTOs.Campaigns
{
    public class UpdateCampaignParamDto : UserInfoParamDto
    {
        public int CampaignId { get; set; }
        public string CampaignName { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int StatusId { get; set; }
    }
}

