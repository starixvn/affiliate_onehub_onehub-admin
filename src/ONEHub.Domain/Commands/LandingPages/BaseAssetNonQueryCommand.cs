using Fanex.Data.Repository;

namespace ONEHub.Domain.Commands.LandingPages;

public abstract class BaseAssetNonQueryCommand : NonQueryCommand
{
    public int UserId { get; set; }

    public string Ip { get; set; } = string.Empty;

    public string FunctionName { get; set; } = string.Empty;

    public int ErrCode { get; set; }

    public string ErrMsg { get; set; } = string.Empty;
}

