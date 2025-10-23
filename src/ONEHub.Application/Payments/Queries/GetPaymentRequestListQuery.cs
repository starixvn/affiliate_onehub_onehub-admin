using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Payments;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Payments.Queries;

public record GetPaymentRequestListQuery(PaymentRequestParamDto Param)
    : IRequest<EntityResult<PaymentRequestDto>>;

public class GetPaymentRequestListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetPaymentRequestListQueryHandler> logger)
    : IRequestHandler<GetPaymentRequestListQuery, EntityResult<PaymentRequestDto>>
{
    public async Task<EntityResult<PaymentRequestDto>> Handle(
        GetPaymentRequestListQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = request.Param;
            var results = await repository.FetchAsync<PaymentRequestDto>(param);
            var list = results.ToList();

            return new EntityResult<PaymentRequestDto>
            {
                MainData = list,
                TotalItem = list.Count,
                PageIndex = param.PageIndex,
                PageSize = param.PageSize
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching payment request list");
            return new EntityResult<PaymentRequestDto>();
        }
    }
}

