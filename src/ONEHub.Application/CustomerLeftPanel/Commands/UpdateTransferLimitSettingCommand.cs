using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Customer;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.CustomerLeftPanel.Commands;

public record UpdateTransferLimitSettingCommand(TransferLimitSettingParamDto Param) : IRequest<ResultInfo>;

public class UpdateTransferLimitSettingCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateTransferLimitSettingCommandHandler> logger)
    : IRequestHandler<UpdateTransferLimitSettingCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateTransferLimitSettingCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            if (!request.Param.DisabledTransfer && request.Param.TransferLimit == 0)
            {
                return ResultInfo.GenerateError("Limit must be a whole positive number.");
            }

            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Update transfer limit setting failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating transfer limit setting: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error updating transfer limit setting");
        }
    }
}

