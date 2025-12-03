using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Commands;

public class CreateGSheetsDomainCommand : NonQueryCommand
{
    public string Data { get; set; }

    public byte DomainType { get; set; }

    public byte SiteId { get; set; }

    public int ErrCode { get; set; }

    public string ErrMsg { get; set; } = string.Empty;

    public override string GetSettingKey() => "OH_Domain_Ins";

    public override bool IsValid()
        => !string.IsNullOrWhiteSpace(Data)
           && SiteId > 0;
}
