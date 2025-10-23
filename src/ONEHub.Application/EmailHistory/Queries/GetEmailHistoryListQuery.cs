using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.EmailHistory;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.EmailHistory.Queries;

public record GetEmailHistoryListQuery(EmailHistoryParamDto Param) : IRequest<EntityResult<EmailHistoryInfoDto>>;

public class GetEmailHistoryListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetEmailHistoryListQueryHandler> logger)
    : IRequestHandler<GetEmailHistoryListQuery, EntityResult<EmailHistoryInfoDto>>
{
    public async Task<EntityResult<EmailHistoryInfoDto>> Handle(
        GetEmailHistoryListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<EmailHistoryInfoDto>(request.Param);
        var list = results.ToList();

        return new EntityResult<EmailHistoryInfoDto>
        {
            MainData = list,
            TotalItem = list.FirstOrDefault()?.EmailId ?? 0,
            PageIndex = request.Param.PageIndex,
            PageSize = request.Param.PageSize
        };
    }
}

