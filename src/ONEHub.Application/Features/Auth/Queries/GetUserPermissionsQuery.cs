using ONEHub.Application.Common;
using ONEHub.Application.DTOs.Auth;

namespace ONEHub.Application.Features.Auth.Queries;

public class GetUserPermissionsQuery : BaseQuery<IEnumerable<UserPermissionDto>>
{
    public new int UserId { get; set; }
}

