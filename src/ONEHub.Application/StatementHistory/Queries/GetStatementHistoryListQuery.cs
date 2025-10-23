using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.StatementHistory.Queries;

public record GetStatementHistoryListQuery(AffiliatePagingByDateParamDto Param) : IRequest<EntityResult<StatementHistoryDto>>;

public class GetStatementHistoryListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetStatementHistoryListQueryHandler> logger)
    : IRequestHandler<GetStatementHistoryListQuery, EntityResult<StatementHistoryDto>>
{
    public async Task<EntityResult<StatementHistoryDto>> Handle(
        GetStatementHistoryListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<StatementHistoryDto>(request.Param);
        var list = results.ToList();

        return new EntityResult<StatementHistoryDto>
        {
            MainData = list,
            TotalItem = list.Count,
            PageIndex = request.Param.PageIndex,
            PageSize = request.Param.PageSize
        };
    }
}

