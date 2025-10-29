using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.NoteBase.Commands;

public record InsertNoteCommand(InsertUpdateNoteParamDto Param) : IRequest<ResultInfo>;

public class InsertNoteCommandHandler(
    IDynamicRepository repository,
    ILogger<InsertNoteCommandHandler> logger)
    : IRequestHandler<InsertNoteCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        InsertNoteCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Note insert failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error inserting note: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error inserting note");
        }
    }
}

