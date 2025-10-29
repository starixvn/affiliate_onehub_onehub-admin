using MediatR;
using ONEHub.Application.DTOs.Operations;
using ONEHub.Domain.Criterias.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Operations.Queries;

public record GetPaymentFrequencyQuery : IRequest<IEnumerable<PaymentFrequencyDto>>;

public class GetPaymentFrequencyQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetPaymentFrequencyQuery, IEnumerable<PaymentFrequencyDto>>
{
    public async Task<IEnumerable<PaymentFrequencyDto>> Handle(
        GetPaymentFrequencyQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new SimpleCriteria("Aff_Admin_PaymentFrequency_Sel");
        var results = await repository.FetchAsync<PaymentFrequencyDto>(criteria);
        return results;
    }
}

