using MediatR;
using ONEHub.Application.DTOs.Operations;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Operations.Queries;

public record GetDealsQuery(DealParamDto Param) : IRequest<EntityResult<DealInfoDto>>;

public class GetDealsQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetDealsQuery, EntityResult<DealInfoDto>>
{
    public async Task<EntityResult<DealInfoDto>> Handle(
        GetDealsQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<DealInfoDto>(request.Param);
        var list = results.ToList();

        return new EntityResult<DealInfoDto>
        {
            MainData = list,
            TotalItem = list.FirstOrDefault()?.RowNum ?? 0,
            PageIndex = request.Param.PageIndex,
            PageSize = request.Param.PageSize
        };
    }
}

