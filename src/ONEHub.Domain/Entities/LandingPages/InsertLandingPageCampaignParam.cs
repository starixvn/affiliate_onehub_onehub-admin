using ONEHub.Domain.Constants;
using System.ComponentModel.DataAnnotations;

namespace ONEHub.Domain.Entities.LandingPages;

public class InsertLandingPageCampaignParam
{
    [Required]
    public string CampaignName { get; set; }
    public string Description { get; set; }
    public int StatusId { get; set; } = LandingPageConstants.CampaignStatusTypes.Active;
    public int UserId { get; set; }
    public string Ip { get; set; }
}

