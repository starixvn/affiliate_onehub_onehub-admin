using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.UserAccount.Commands;

public record UpdateUserAccountCommand(UserAccountParamDto Param) : IRequest<ResultInfo>;

public class UpdateUserAccountCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateUserAccountCommandHandler> logger)
    : IRequestHandler<UpdateUserAccountCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateUserAccountCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("User account update failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating user account: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error updating user account");
        }
    }
}

