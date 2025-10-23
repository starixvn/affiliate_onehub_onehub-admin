using Fanex.Data.Repository;

namespace ONEHub.Domain.Commands.Campaigns;

public class UpdateCampaignCommand : NonQueryCommand
{
    private const string SP_NAME = "Aff_LandingPage_Campaign_Upd";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid()
    {
        return StatusId >= 0
            && CampaignId > 0
            && !string.IsNullOrWhiteSpace(CampaignName);
    }

    public int CampaignId { get; set; }
    public string CampaignName { get; set; } = string.Empty;
    public string? Description { get; set; }
    public int StatusId { get; set; }
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    public int ErrCode { get; set; }
    public string? ErrMsg { get; set; }
}

