using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Messages;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Messages.Queries;

public record GetMessageDetailQuery(int SelectedMessageId) : IRequest<MessageDetailDto>;

public class GetMessageDetailQueryHandler(
    IDynamicRepository repository,
    ILogger<GetMessageDetailQueryHandler> logger)
    : IRequestHandler<GetMessageDetailQuery, MessageDetailDto>
{
    public async Task<MessageDetailDto> Handle(
        GetMessageDetailQuery request,
        CancellationToken cancellationToken)
    {
        var result = await repository.FetchAsync<MessageDetailDto>(new { MessageId = request.SelectedMessageId });
        return result.FirstOrDefault() ?? new MessageDetailDto();
    }
}

