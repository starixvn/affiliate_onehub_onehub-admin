namespace ONEHub.Infrastructure.Repositories.Commands;

public class UpdateLinkStatusCommand : BaseCommand
{
    public int LinkId { get; set; }

    public int StatusId { get; set; }

    public override string GetSettingKey() => "OH_LinkGenerator_Upd";

    public override bool IsValid() => LinkId > 0 && StatusId >= 0;
}

