using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Customer;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.CustomerLeftPanel.Commands;

public record UpdateAffTypeCommand(UpdateAffTypeParamDto Param) : IRequest<ResultInfo>;

public class UpdateAffTypeCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateAffTypeCommandHandler> logger)
    : IRequestHandler<UpdateAffTypeCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateAffTypeCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Update affiliate type failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating affiliate type: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error updating affiliate type");
        }
    }
}

