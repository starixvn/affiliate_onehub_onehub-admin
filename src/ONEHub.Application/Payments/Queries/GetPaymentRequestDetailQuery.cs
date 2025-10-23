using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Payments;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Payments.Queries;

public record GetPaymentRequestDetailQuery(long TransId) : IRequest<PaymentRequestDetailDto?>;

public class GetPaymentRequestDetailQueryHandler(
    IDynamicRepository repository,
    ILogger<GetPaymentRequestDetailQueryHandler> logger)
    : IRequestHandler<GetPaymentRequestDetailQuery, PaymentRequestDetailDto?>
{
    public async Task<PaymentRequestDetailDto?> Handle(
        GetPaymentRequestDetailQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            if (request.TransId <= 0)
            {
                logger.LogWarning("Invalid TransId: {TransId}", request.TransId);
                return null;
            }

            var result = await repository.GetAsync<PaymentRequestDetailDto>(
                new { TransId = request.TransId });

            return result;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching payment request detail for TransId: {TransId}", request.TransId);
            return null;
        }
    }
}

