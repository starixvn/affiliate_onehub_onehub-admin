using MediatR;
using ONEHub.Application.DTOs.Operations;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Operations.Queries;

public record GetNormalDealListQuery(GetNormalDealParamDto Param) : IRequest<IEnumerable<NormalDealDto>>;

public class GetNormalDealListQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetNormalDealListQuery, IEnumerable<NormalDealDto>>
{
    public async Task<IEnumerable<NormalDealDto>> Handle(
        GetNormalDealListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<NormalDealDto>(request.Param);
        return results;
    }
}

