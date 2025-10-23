using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Payments;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.Payments.Commands;

public record UpdatePaymentRequestCommand(PaymentRequestUpdateParamDto Param) : IRequest<ResultInfo>;

public class UpdatePaymentRequestCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdatePaymentRequestCommandHandler> logger)
    : IRequestHandler<UpdatePaymentRequestCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdatePaymentRequestCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = request.Param;

            if (param.TransId <= 0)
            {
                return ResultInfo.GenerateErr("Invalid TransId.");
            }

            if (param.AffId <= 0)
            {
                return ResultInfo.GenerateErr("Invalid AffId.");
            }

            var result = await repository.ExecuteAsync(new
            {
                TransId = param.TransId,
                AffId = param.AffId,
                IsApproved = param.IsApproved,
                AdminDescription = param.AdminDescription,
                UpdatedBy = param.UpdatedBy,
                Ip = param.Ip
            });

            return result > 0
                ? ResultInfo.GenerateSuccess("Payment request updated successfully.")
                : ResultInfo.GenerateErr("Failed to update payment request.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating payment request for TransId: {TransId}", request.Param.TransId);
            return ResultInfo.GenerateErr($"Error updating payment request: {ex.Message}");
        }
    }
}

