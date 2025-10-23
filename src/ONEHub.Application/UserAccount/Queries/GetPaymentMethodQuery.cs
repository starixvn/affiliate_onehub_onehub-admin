using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.UserAccount.Queries;

public record GetPaymentMethodQuery : IRequest<PaymentMethodResultDto>;

public class GetPaymentMethodQueryHandler(
    IDynamicRepository repository,
    ILogger<GetPaymentMethodQueryHandler> logger)
    : IRequestHandler<GetPaymentMethodQuery, PaymentMethodResultDto>
{
    public async Task<PaymentMethodResultDto> Handle(
        GetPaymentMethodQuery request,
        CancellationToken cancellationToken)
    {
        var paymentMethods = await repository.FetchAsync<PaymentMethodInfoDto>(new { });

        return new PaymentMethodResultDto
        {
            PaymentMethods = paymentMethods,
            MinAmount = 0m
        };
    }
}

