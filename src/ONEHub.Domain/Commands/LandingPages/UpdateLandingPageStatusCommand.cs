using Fanex.Data.Repository;

namespace ONEHub.Domain.Commands.LandingPages;

public class UpdateLandingPageStatusCommand : NonQueryCommand
{
    private const string SP_NAME = "Aff_LandingPage_Builder_Upd";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => PageId > 0;

    public int PageId { get; set; }
    public byte StatusId { get; set; }
    public bool IsUpdStatus { get; } = true;
    public int UserId { get; set; }
    public string Ip { get; set; } = string.Empty;

    public int ErrCode { get; set; }
    public string? ErrMsg { get; set; }
}

