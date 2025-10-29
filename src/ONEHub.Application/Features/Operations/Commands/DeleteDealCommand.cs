using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Operations;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.Features.Operations.Commands;

public record DeleteDealCommand(DeleteDealParamDto Param) : IRequest<ResultInfo>;

public class DeleteDealCommandHandler(
    IDynamicRepository repository,
    ILogger<DeleteDealCommandHandler> logger)
    : IRequestHandler<DeleteDealCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        DeleteDealCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = request.Param;

            if (param.DealId <= 0)
            {
                return ResultInfo.GenerateErr("DealId is required.");
            }

            var result = await repository.ExecuteAsync(new
            {
                GroupId = param.DealId,
                param.UserId,
                param.Ip
            });

            return result > 0
                ? ResultInfo.GenerateSuccess("Deal deleted successfully.")
                : ResultInfo.GenerateErr("Failed to delete deal.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting deal");
            return ResultInfo.GenerateErr($"Error deleting deal: {ex.Message}");
        }
    }
}

