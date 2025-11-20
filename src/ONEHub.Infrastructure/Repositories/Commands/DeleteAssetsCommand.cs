namespace ONEHub.Infrastructure.Repositories.Commands;

public class DeleteAssetsCommand : BaseCommand
{
    public string MediaIds { get; set; } = string.Empty;

    public override string GetSettingKey() => "OH_AssetUploader_Del";

    public override bool IsValid() => !string.IsNullOrWhiteSpace(MediaIds);
}
