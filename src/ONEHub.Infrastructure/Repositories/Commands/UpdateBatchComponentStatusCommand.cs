namespace ONEHub.Infrastructure.Repositories.Commands;

public class UpdateBatchComponentStatusCommand : BaseCommand
{
    public string ComponentIds { get; set; } = string.Empty;

    public int StatusId { get; set; }

    public override string GetSettingKey() => "OH_Component_Status_Upd";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(ComponentIds) && StatusId >= 0;
}
