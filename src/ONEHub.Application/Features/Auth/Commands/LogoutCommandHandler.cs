using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Commands.Auth;
using ONEHub.Domain.DTOs.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Auth.Commands;

public class LogoutCommandHandler(
    IDynamicRepository repository,
    ISessionService sessionService,
    IRefreshTokenService refreshTokenService,
    ILogger<LogoutCommandHandler> logger)
    : IRequestHandler<LogoutCommand, bool>
{
    public async Task<bool> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (sessionService.OnUserId > 0)
            {
                var command = new LogoutCommandData
                {
                    OnUserId = sessionService.OnUserId
                };

                await repository.ExecuteAsync(command);

                logger.LogInformation("User OnUserId: {OnUserId} logged out successfully", sessionService.OnUserId);
            }

            if (sessionService.UserId > 0)
            {
                await refreshTokenService.RevokeAllByUserIdAsync(sessionService.UserId, request.IpAddress);
                logger.LogInformation("Revoked all refresh tokens for UserId: {UserId}", sessionService.UserId);
            }

            sessionService.UserId = 0;
            sessionService.OnUserId = 0;
            sessionService.AffName = string.Empty;
            sessionService.UserPermissionList = new List<UserPermission>();

            return true;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error during logout for OnUserId: {OnUserId}", sessionService.OnUserId);
            return false;
        }
    }
}

