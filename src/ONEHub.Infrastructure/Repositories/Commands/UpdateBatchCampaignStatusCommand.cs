namespace ONEHub.Infrastructure.Repositories.Commands;

public class UpdateBatchCampaignStatusCommand : BaseCommand
{
    public string CampaignIds { get; set; } = string.Empty;

    public int StatusId { get; set; }

    public override string GetSettingKey() => "OH_Campaign_Status_Upd";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(CampaignIds) && StatusId >= 0;
}
