using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Members;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Members.Commands;

public record UpdateMemberCommand(UpdateMemberParamDto Param) : IRequest<ResultInfo>;

public class UpdateMemberCommandHandler(
    IDynamicRepository repository,
    IMediator mediator,
    ILogger<UpdateMemberCommandHandler> logger)
    : IRequestHandler<UpdateMemberCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateMemberCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var latestBillingDate = await mediator.Send(new Queries.GetLatestBillingDateQuery(), cancellationToken);
            var now = DateTime.UtcNow.AddHours(8);
            var nextMonth = new DateTime(now.Year, now.Month, 1).AddMonths(2);

            if (request.Param.FromDate <= latestBillingDate || request.Param.FromDate >= nextMonth)
            {
                return ResultInfo.GenerateError(
                    "The selected date cannot be earlier than the latest billing date or greater than next month.");
            }

            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Member update failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating member: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error updating member");
        }
    }
}

