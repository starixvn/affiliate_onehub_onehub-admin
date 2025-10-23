using MediatR;
using ONEHub.Application.DTOs.Operations;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Operations.Queries;

public record GetDeductionListQuery : IRequest<IEnumerable<DeductionItemDto>>;

public class GetDeductionListQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetDeductionListQuery, IEnumerable<DeductionItemDto>>
{
    public async Task<IEnumerable<DeductionItemDto>> Handle(
        GetDeductionListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<DeductionItemDto>(new { });
        return results;
    }
}

