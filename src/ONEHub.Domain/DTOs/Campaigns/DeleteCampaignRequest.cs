using System.ComponentModel.DataAnnotations;

namespace ONEHub.Domain.DTOs.Campaigns;

public class DeleteCampaignRequest
{
    [Required]
    [MinLength(1, ErrorMessage = "At least one campaign ID is required")]
    public List<int> CampaignIds { get; set; } = [];
}
