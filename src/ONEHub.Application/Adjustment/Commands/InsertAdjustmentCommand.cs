using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Adjustment.Commands;

public record InsertAdjustmentCommand(AdjustmentParamDto Param) : IRequest<ResultInfo>;

public class InsertAdjustmentCommandHandler(
    IDynamicRepository repository,
    ILogger<InsertAdjustmentCommandHandler> logger)
    : IRequestHandler<InsertAdjustmentCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        InsertAdjustmentCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Adjustment insert failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error inserting adjustment: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error inserting adjustment");
        }
    }
}

