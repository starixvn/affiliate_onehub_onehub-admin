using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Messages;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.Messages.Commands;

public record DeleteMessagesCommand(DeleteMessageParamDto Param) : IRequest<ResultInfo>;

public class DeleteMessagesCommandHandler(
    IDynamicRepository repository,
    ILogger<DeleteMessagesCommandHandler> logger)
    : IRequestHandler<DeleteMessagesCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        DeleteMessagesCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = new
            {
                request.Param.UserId,
                request.Param.Ip,
                MessageIds = request.Param.MessageIdList
            };

            var result = await repository.ExecuteAsync(param);
            return result > 0
                ? ResultInfo.GenerateSuccess("Messages deleted successfully.")
                : ResultInfo.GenerateErr("Failed to delete messages.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting messages");
            return ResultInfo.GenerateErr($"Error deleting messages: {ex.Message}");
        }
    }
}

