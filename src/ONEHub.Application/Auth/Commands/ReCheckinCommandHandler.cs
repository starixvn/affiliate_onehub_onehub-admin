using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Commands.Auth;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Auth.Commands;

public class ReCheckinCommandHandler : IRequestHandler<ReCheckinCommand, bool>
{
    private readonly IDynamicRepository _repository;
    private readonly ILogger<ReCheckinCommandHandler> _logger;

    public ReCheckinCommandHandler(
        IDynamicRepository repository,
        ILogger<ReCheckinCommandHandler> _logger)
    {
        _repository = repository;
        this._logger = _logger;
    }

    public async Task<bool> Handle(ReCheckinCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var command = new ReCheckinCommandData
            {
                OnUserId = request.OnUserId
            };

            await _repository.ExecuteAsync(command);

            if (command.IsKickedOut)
            {
                _logger.LogWarning("User OnUserId: {OnUserId} has been kicked out", request.OnUserId);
            }

            return command.IsKickedOut;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during recheckin for OnUserId: {OnUserId}", request.OnUserId);
            return true;
        }
    }
}

