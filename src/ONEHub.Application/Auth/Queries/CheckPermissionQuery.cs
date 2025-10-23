using ONEHub.Application.Common;

namespace ONEHub.Application.Auth.Queries;

public class CheckPermissionQuery : BaseQuery<bool>
{
    public new int UserId { get; set; }
    public string FunctionName { get; set; } = string.Empty;
}

