using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Administrators.Commands;

public record UpdateUserCommand(UpdateUserParamDto Param) : IRequest<ResultInfo>;

public class UpdateUserCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateUserCommandHandler> logger)
    : IRequestHandler<UpdateUserCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateUserCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("User update failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating user: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error updating user");
        }
    }
}

