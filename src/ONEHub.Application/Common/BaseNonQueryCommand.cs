using Fanex.Data.Repository;

namespace ONEHub.Application.Common;

public abstract class BaseNonQueryCommand : NonQueryCommand
{
    public int ErrCode { get; set; }
    public string? ErrMsg { get; set; }
}

