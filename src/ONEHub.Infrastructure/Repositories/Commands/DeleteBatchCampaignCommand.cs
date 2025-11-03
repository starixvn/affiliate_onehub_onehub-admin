namespace ONEHub.Infrastructure.Repositories.Commands;

public class DeleteBatchCampaignCommand : BaseCommand
{
    public string CampaignIds { get; set; } = string.Empty;

    public override string GetSettingKey() => "OH_Campaign_Del";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(CampaignIds);
}
