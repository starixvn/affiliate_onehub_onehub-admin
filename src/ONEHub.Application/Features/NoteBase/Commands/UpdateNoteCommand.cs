using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.NoteBase.Commands;

public record UpdateNoteCommand(InsertUpdateNoteParamDto Param) : IRequest<ResultInfo>;

public class UpdateNoteCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateNoteCommandHandler> logger)
    : IRequestHandler<UpdateNoteCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateNoteCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Note update failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating note: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error updating note");
        }
    }
}

