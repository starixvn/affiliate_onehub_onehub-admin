using ONEHub.Domain.DTOs.Common;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Domain.DTOs.Campaigns;

public class UpdateCampaignRequest : UserInfoRequest
{
    [Required]
    public int CampaignId { get; set; }

    [Required]
    public string CampaignName { get; set; } = string.Empty;

    public string? Description { get; set; }

    [Range(0, int.MaxValue)]
    public int StatusId { get; set; }
}

