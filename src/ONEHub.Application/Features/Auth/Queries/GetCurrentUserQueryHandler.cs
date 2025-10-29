using MediatR;
using ONEHub.Application.DTOs.Auth;

namespace ONEHub.Application.Features.Auth.Queries;

public class GetCurrentUserQueryHandler : IRequestHandler<GetCurrentUserQuery, CurrentUserDto>
{
    public async Task<CurrentUserDto> Handle(GetCurrentUserQuery request, CancellationToken cancellationToken)
    {
        await Task.CompletedTask;

        return new CurrentUserDto
        {
            UserId = request.UserId,
            UserName = string.Empty,
            FirstName = string.Empty,
            LastName = string.Empty,
            Email = string.Empty,
            GroupId = 0,
            GroupName = string.Empty,
            Permissions = Array.Empty<UserPermissionDto>()
        };
    }
}

