using Fanex.Data.Repository;

namespace ONEHub.Domain.Commands.Components;

public class InsertComponentCommand : NonQueryCommand
{
    private const string SP_NAME = "OH_Component_Ins";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid()
    {
        return ComponentTypeId > 0
            && !string.IsNullOrWhiteSpace(ComponentName)
            && !string.IsNullOrWhiteSpace(ComponentCode);
    }

    public string ComponentName { get; set; } = string.Empty;
    public string ComponentCode { get; set; } = string.Empty;
    public int ComponentTypeId { get; set; }
    public int StatusId { get; set; }
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    public int ComponentId { get; set; }
    public int ErrCode { get; set; }
    public string? ErrMsg { get; set; }
}

