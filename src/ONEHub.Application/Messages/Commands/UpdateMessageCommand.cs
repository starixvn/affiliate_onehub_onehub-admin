using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Messages;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.Messages.Commands;

public record UpdateMessageCommand(InsertUpdateMessageParamDto Param) : IRequest<ResultInfo>;

public class UpdateMessageCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateMessageCommandHandler> logger)
    : IRequestHandler<UpdateMessageCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateMessageCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            if (!request.Param.IsValid())
            {
                return ResultInfo.GenerateErr("Please provide at least one message in any language.");
            }

            var param = new
            {
                request.Param.MessageId,
                request.Param.UserId,
                request.Param.Ip,
                IsImportant = request.Param.Important,
                MsgEn = request.Param.Message_en,
                MsgCn = request.Param.Message_cs,
                MsgTh = request.Param.Message_th,
                MsgVi = request.Param.Message_vn,
                MsgId = request.Param.Message_id,
                MsgKr = request.Param.Message_ko
            };

            var result = await repository.ExecuteAsync(param);
            return result > 0
                ? ResultInfo.GenerateSuccess("Message updated successfully.")
                : ResultInfo.GenerateErr("Failed to update message.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating message");
            return ResultInfo.GenerateErr($"Error updating message: {ex.Message}");
        }
    }
}

