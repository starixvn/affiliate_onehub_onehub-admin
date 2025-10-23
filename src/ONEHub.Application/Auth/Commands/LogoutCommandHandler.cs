using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Commands.Auth;
using ONEHub.Domain.DTOs.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Auth.Commands;

public class LogoutCommandHandler : IRequestHandler<LogoutCommand, bool>
{
    private readonly IDynamicRepository _repository;
    private readonly ISessionService _sessionService;
    private readonly ILogger<LogoutCommandHandler> _logger;

    public LogoutCommandHandler(
        IDynamicRepository repository,
        ISessionService sessionService,
        ILogger<LogoutCommandHandler> logger)
    {
        _repository = repository;
        _sessionService = sessionService;
        _logger = logger;
    }

    public async Task<bool> Handle(LogoutCommand request, CancellationToken cancellationToken)
    {
        try
        {
            if (_sessionService.OnUserId > 0)
            {
                var command = new LogoutCommandData
                {
                    OnUserId = _sessionService.OnUserId
                };

                await _repository.ExecuteAsync(command);

                _logger.LogInformation("User OnUserId: {OnUserId} logged out successfully", _sessionService.OnUserId);
            }

            _sessionService.UserId = 0;
            _sessionService.OnUserId = 0;
            _sessionService.AffName = string.Empty;
            _sessionService.UserPermissionList = new List<UserPermission>();

            return true;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during logout for OnUserId: {OnUserId}", _sessionService.OnUserId);
            return false;
        }
    }
}

