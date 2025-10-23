using MediatR;

namespace ONEHub.Application.Auth.Queries;

public class CheckPermissionQueryHandler : IRequestHandler<CheckPermissionQuery, bool>
{
    public async Task<bool> Handle(CheckPermissionQuery request, CancellationToken cancellationToken)
    {
        await Task.CompletedTask;
        return true;
    }
}

