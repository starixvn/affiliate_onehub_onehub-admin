using Fanex.Data;

namespace ONEHub.Infrastructure.Repositories.Commands;

public class UpdateComponentCommand : BaseCommand
{
    [SpParam(SqlParamName = "ComponentTypeId")]
    public int CategoryId { get; set; }

    public int ComponentId { get; set; }

    public string ComponentName { get; set; } = string.Empty;

    public int StatusId { get; set; }

    public int? DeviceId { get; set; }

    public override string GetSettingKey() => "OH_Component_Upd";

    public override bool IsValid()
        => StatusId >= 0
        && !string.IsNullOrWhiteSpace(ComponentName)
        && ComponentId > 0
        && CategoryId > 0;
}
