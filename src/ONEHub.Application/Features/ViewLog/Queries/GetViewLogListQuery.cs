using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.ViewLog.Queries;

public record GetViewLogListQuery(ViewLogParamDto Param) : IRequest<EntityResult<ViewLogDto>>;

public class GetViewLogListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetViewLogListQueryHandler> logger)
    : IRequestHandler<GetViewLogListQuery, EntityResult<ViewLogDto>>
{
    public async Task<EntityResult<ViewLogDto>> Handle(
        GetViewLogListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<ViewLogDto>(request.Param);
        var list = results.ToList();

        return new EntityResult<ViewLogDto>
        {
            MainData = list,
            TotalItem = list.Count,
            PageIndex = request.Param.PageIndex,
            PageSize = request.Param.PageSize
        };
    }
}

