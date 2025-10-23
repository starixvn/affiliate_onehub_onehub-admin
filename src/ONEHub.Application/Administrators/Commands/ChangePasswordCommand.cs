using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Administrators.Commands;

public record ChangePasswordCommand(UpdatePasswordParamDto Param) : IRequest<ResultInfo>;

public class ChangePasswordCommandHandler(
    IDynamicRepository repository,
    ILogger<ChangePasswordCommandHandler> logger)
    : IRequestHandler<ChangePasswordCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        ChangePasswordCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Password change failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error changing password: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error changing password");
        }
    }
}

