using Fanex.Data.Repository;

namespace ONEHub.Domain.Commands.Campaigns;

public class DeleteCampaignsCommand : NonQueryCommand
{
    private const string SP_NAME = "Aff_LandingPage_Campaign_Del";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid()
    {
        return !string.IsNullOrWhiteSpace(CampaignIds);
    }

    public string CampaignIds { get; set; } = string.Empty;
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    public int ErrCode { get; set; }
    public string? ErrMsg { get; set; }
}
