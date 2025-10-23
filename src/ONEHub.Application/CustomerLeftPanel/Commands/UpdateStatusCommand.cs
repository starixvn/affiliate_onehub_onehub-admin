using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Customer;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.CustomerLeftPanel.Commands;

public record UpdateStatusCommand(UpdateStatusParamDto Param) : IRequest<ResultInfo>;

public class UpdateStatusCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateStatusCommandHandler> logger)
    : IRequestHandler<UpdateStatusCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateStatusCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Update status failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating status: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error updating status");
        }
    }
}

