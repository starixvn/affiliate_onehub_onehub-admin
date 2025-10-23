using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Administrators.Commands;

public record ChangeStatusCommand(ChangeStatusParamDto Param) : IRequest<ResultInfo>;

public class ChangeStatusCommandHandler(
    IDynamicRepository repository,
    ILogger<ChangeStatusCommandHandler> logger)
    : IRequestHandler<ChangeStatusCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        ChangeStatusCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Status change failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error changing status: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error changing status");
        }
    }
}

