namespace ONEHub.Infrastructure.Repositories.Commands;

public class DeleteBatchComponentCommand : BaseCommand
{
    public string ComponentIds { get; set; } = string.Empty;

    public override string GetSettingKey() => "OH_Component_Del";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(ComponentIds);
}
