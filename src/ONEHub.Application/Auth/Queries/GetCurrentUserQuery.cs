using ONEHub.Application.Common;
using ONEHub.Application.DTOs.Auth;

namespace ONEHub.Application.Auth.Queries;

public class GetCurrentUserQuery : BaseQuery<CurrentUserDto>
{
    public new int UserId { get; set; }
}

