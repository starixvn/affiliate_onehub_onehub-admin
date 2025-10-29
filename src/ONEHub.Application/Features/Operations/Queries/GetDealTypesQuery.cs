using MediatR;
using ONEHub.Application.DTOs.Operations;
using ONEHub.Domain.Criterias.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Operations.Queries;

public record GetDealTypesQuery : IRequest<IEnumerable<DealTypeDto>>;

public class GetDealTypesQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetDealTypesQuery, IEnumerable<DealTypeDto>>
{
    public async Task<IEnumerable<DealTypeDto>> Handle(
        GetDealTypesQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new SimpleCriteria("Aff_Admin_DealTypeInfo_Sel");
        var results = await repository.FetchAsync<DealTypeDto>(criteria);
        return results.OrderBy(x => x.GroupTypeName);
    }
}

