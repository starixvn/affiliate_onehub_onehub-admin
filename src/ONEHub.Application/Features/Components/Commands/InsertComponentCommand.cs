using Fanex.Logging;
using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.Results;
using InsertCommand = ONEHub.Domain.Commands.Components.InsertComponentCommand;

namespace ONEHub.Application.Features.Components.Commands;

public class InsertComponentCommand : BaseNonResultCommand
{
    public string ComponentName { get; set; } = string.Empty;

    public string ComponentCode { get; set; } = string.Empty;

    public int ComponentTypeId { get; set; }

    public int StatusId { get; set; }
}

public class InsertComponentCommandHandler : IRequestHandler<InsertComponentCommand, Result>
{
    private readonly IDynamicRepository _repository;
    private readonly ILogger _logger;

    public InsertComponentCommandHandler(
        IDynamicRepository repository,
        ILogger logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<Result> Handle(InsertComponentCommand request, CancellationToken cancellationToken)
    {
        try
        {
            var command = new InsertCommand
            {
                ComponentName = request.ComponentName.Trim(),
                ComponentCode = request.ComponentCode.Trim(),
                ComponentTypeId = request.ComponentTypeId,
                StatusId = request.StatusId,
                UserId = request.UserId,
                Ip = request.Ip
            };

            await _repository.ExecuteAsync(command);

            if (command.ErrCode != 0)
            {
                _logger.Error($"InsertComponent failed: {command.ErrMsg}");
                return Result.Failure(new Error(command.ErrCode, command.ErrMsg ?? "Error creating component"));
            }

            return Result.Success();
        }
        catch (Exception ex)
        {
            _logger.Error($"Error creating component: {ex.Message}", ex);
            return Result.Failure(new Error(-1, $"Error creating component: {ex.Message}"));
        }
    }
}

