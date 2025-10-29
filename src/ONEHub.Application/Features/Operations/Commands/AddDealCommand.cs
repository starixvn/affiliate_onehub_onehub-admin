using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Operations;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.Features.Operations.Commands;

public record AddDealCommand(DealSettingParamDto Param) : IRequest<ResultInfo>;

public class AddDealCommandHandler(
    IDynamicRepository repository,
    ILogger<AddDealCommandHandler> logger)
    : IRequestHandler<AddDealCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        AddDealCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = request.Param;

            if (string.IsNullOrWhiteSpace(param.DealName))
            {
                return ResultInfo.GenerateErr("Deal name is required.");
            }

            var result = await repository.ExecuteAsync(new
            {
                GroupId = 0,
                GroupTypeId = param.DealType,
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
                StartDate = param.StartDate ?? DateTime.Now,
                param.ScheduleId,
                param.UserId,
                param.Ip
            });

            return result > 0
                ? ResultInfo.GenerateSuccess("Deal added successfully.")
                : ResultInfo.GenerateErr("Failed to add deal.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error adding deal");
            return ResultInfo.GenerateErr($"Error adding deal: {ex.Message}");
        }
    }
}

