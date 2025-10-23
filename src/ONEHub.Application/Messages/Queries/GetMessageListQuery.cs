using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Messages;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Messages.Queries;

public record GetMessageListQuery(MessageParamDto Param) : IRequest<EntityResult<MessageInfoDto>>;

public class GetMessageListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetMessageListQueryHandler> logger)
    : IRequestHandler<GetMessageListQuery, EntityResult<MessageInfoDto>>
{
    public async Task<EntityResult<MessageInfoDto>> Handle(
        GetMessageListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<MessageInfoDto>(request.Param);
        var list = results.ToList();

        return new EntityResult<MessageInfoDto>
        {
            MainData = list,
            TotalItem = list.FirstOrDefault()?.MessageId ?? 0,
            PageIndex = request.Param.PageIndex,
            PageSize = request.Param.PageSize
        };
    }
}

