using Fanex.Data;

namespace ONEHub.Infrastructure.Repositories.Commands;

public class CreateComponentCommand : BaseCommand
{
    [SpParam(SqlParamName = "ComponentTypeId")]
    public int CategoryId { get; set; }

    public string ComponentName { get; set; } = string.Empty;

    public string ComponentCode { get; set; } = string.Empty;

    public int StatusId { get; set; }

    public int? DeviceId { get; set; }

    public override string GetSettingKey() => "OH_Component_Ins";

    public override bool IsValid()
        => StatusId >= 0
        && !string.IsNullOrWhiteSpace(ComponentName)
        && !string.IsNullOrWhiteSpace(ComponentCode)
        && CategoryId > 0;

    public int ComponentId { get; set; }
}
