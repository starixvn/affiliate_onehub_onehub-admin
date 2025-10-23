using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.PlayerDetail.Queries;

public record GetPlayerDetailListQuery(PlayerDetailParamDto Param) : IRequest<EntityResult<PlayerDetailDto>>;

public class GetPlayerDetailListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetPlayerDetailListQueryHandler> logger)
    : IRequestHandler<GetPlayerDetailListQuery, EntityResult<PlayerDetailDto>>
{
    public async Task<EntityResult<PlayerDetailDto>> Handle(
        GetPlayerDetailListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<PlayerDetailDto>(request.Param);
        var list = results.ToList();

        return new EntityResult<PlayerDetailDto>
        {
            MainData = list,
            TotalItem = list.Count,
            PageIndex = request.Param.PageIndex,
            PageSize = request.Param.PageSize
        };
    }
}

