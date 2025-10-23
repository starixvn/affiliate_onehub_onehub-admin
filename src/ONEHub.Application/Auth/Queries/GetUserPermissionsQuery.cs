using ONEHub.Application.Common;
using ONEHub.Application.DTOs.Auth;

namespace ONEHub.Application.Auth.Queries;

public class GetUserPermissionsQuery : BaseQuery<IEnumerable<UserPermissionDto>>
{
    public new int UserId { get; set; }
}

