using MediatR;
using ONEHub.Application.DTOs.Operations;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Operations.Queries;

public record GetMarketingDealListQuery(GetNormalDealParamDto Param) : IRequest<IEnumerable<NormalDealDto>>;

public class GetMarketingDealListQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetMarketingDealListQuery, IEnumerable<NormalDealDto>>
{
    public async Task<IEnumerable<NormalDealDto>> Handle(
        GetMarketingDealListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<NormalDealDto>(request.Param);
        return results;
    }
}

