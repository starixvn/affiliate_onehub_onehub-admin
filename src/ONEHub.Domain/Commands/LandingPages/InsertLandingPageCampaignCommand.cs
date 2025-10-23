using Fanex.Data.Repository;

namespace ONEHub.Domain.Commands.LandingPages;

public class InsertLandingPageCampaignCommand : NonQueryCommand
{
    private const string SP_NAME = "Aff_LandingPage_Campaign_Ins";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => !string.IsNullOrEmpty(CampaignName);

    public int CampaignId { get; set; }
    public string CampaignName { get; set; }
    public string Description { get; set; }
    public int StatusId { get; set; }
}

