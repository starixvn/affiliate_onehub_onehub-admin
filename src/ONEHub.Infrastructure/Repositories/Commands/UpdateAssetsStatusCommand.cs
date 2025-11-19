namespace ONEHub.Infrastructure.Repositories.Commands;

public class UpdateAssetsStatusCommand : BaseCommand
{
    public string MediaIds { get; set; } = string.Empty;

    public int StatusId { get; set; }

    public override string GetSettingKey() => "OH_AssetUploader_Status_Upd";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(MediaIds) && StatusId >= 0;
}
