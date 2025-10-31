using Fanex.Logging;
using MediatR;
using ONEHub.Domain.DTOs.Common;
using ONEHub.Domain.Interfaces;
using InsertCommand = ONEHub.Domain.Commands.Components.InsertComponentCommand;

namespace ONEHub.Application.Features.Components.Commands;

public record InsertComponentCommand(
    string ComponentName,
    string ComponentCode,
    int ComponentTypeId,
    int StatusId,
    int UserId,
    string Ip
) : IRequest<ResultInfo>;

public class InsertComponentCommandHandler : IRequestHandler<InsertComponentCommand, ResultInfo>
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

    public async Task<ResultInfo> Handle(InsertComponentCommand request, CancellationToken cancellationToken)
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
                return new ResultInfo
                {
                    Code = command.ErrCode,
                    Message = command.ErrMsg ?? "Error creating component"
                };
            }

            return ResultInfo.Success;
        }
        catch (Exception ex)
        {
            _logger.Error($"Error creating component: {ex.Message}", ex);
            return new ResultInfo
            {
                Code = -1,
                Message = $"Error creating component: {ex.Message}"
            };
        }
    }
}

