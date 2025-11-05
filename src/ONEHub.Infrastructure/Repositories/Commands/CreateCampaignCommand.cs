namespace ONEHub.Infrastructure.Repositories.Commands;

public class CreateCampaignCommand : BaseCommand
{
    public string CampaignName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int StatusId { get; set; }

    public override string GetSettingKey() => "OH_Campaign_Ins";

    public override bool IsValid() => StatusId >= 0 && !string.IsNullOrWhiteSpace(CampaignName);
}
