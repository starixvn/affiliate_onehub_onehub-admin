using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Operations;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.Features.Operations.Commands;

public record UpdateDealCommand(DealSettingParamDto Param) : IRequest<ResultInfo>;

public class UpdateDealCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateDealCommandHandler> logger)
    : IRequestHandler<UpdateDealCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateDealCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = request.Param;

            if (param.GroupId <= 0)
            {
                return ResultInfo.GenerateErr("GroupId is required for update.");
            }

            if (string.IsNullOrWhiteSpace(param.DealName))
            {
                return ResultInfo.GenerateErr("Deal name is required.");
            }

            var result = await repository.ExecuteAsync(new
            {
                param.GroupId,
                GroupName = param.DealName,
                param.SubCommRate,
                param.Description,
                param.CountryCodes,
                param.ActiveDays,
                param.HoldingDays,
                param.HoldingTickets,
                param.Quota,
                CpaTierList = string.Empty,
                CpaProductList = string.Empty,
                QMTurnover = param.QmTurnover,
                param.IsActivePlayerSum,
                TierList = string.Empty,
                DeductionList = string.Empty,
                param.RedepositDays,
                param.RedepositRate,
                param.UserId,
                param.Ip
            });

            return result > 0
                ? ResultInfo.GenerateSuccess("Deal updated successfully.")
                : ResultInfo.GenerateErr("Failed to update deal.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating deal");
            return ResultInfo.GenerateErr($"Error updating deal: {ex.Message}");
        }
    }
}

