using MediatR;
using ONEHub.Application.DTOs.Auth;

namespace ONEHub.Application.Features.Auth.Queries;

public class GetUserPermissionsQueryHandler : IRequestHandler<GetUserPermissionsQuery, IEnumerable<UserPermissionDto>>
{
    public async Task<IEnumerable<UserPermissionDto>> Handle(GetUserPermissionsQuery request, CancellationToken cancellationToken)
    {
        await Task.CompletedTask;
        return Array.Empty<UserPermissionDto>();
    }
}

