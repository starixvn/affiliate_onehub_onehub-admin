using Fanex.Data;
using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Commands;

public abstract class BaseCommand : NonQueryCommand
{
    public int UserId { get; set; }

    public string Ip { get; set; } = string.Empty;

    [SpParam(Ignored = true)]
    public string Host { get; set; } = string.Empty;

    public int ErrCode { get; set; }

    public string ErrMsg { get; set; } = string.Empty;
}
