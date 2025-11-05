namespace ONEHub.Infrastructure.Repositories.Commands;

public class UpdateCampaignCommand : BaseCommand
{
    public int CampaignId { get; set; }

    public string CampaignName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int StatusId { get; set; }

    public override string GetSettingKey() => "OH_Campaign_Upd";

    public override bool IsValid() => CampaignId > 0 && StatusId >= 0 && !string.IsNullOrWhiteSpace(CampaignName);
}
