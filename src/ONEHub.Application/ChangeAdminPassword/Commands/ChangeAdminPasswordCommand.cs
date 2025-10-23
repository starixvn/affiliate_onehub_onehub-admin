using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.ChangeAdminPassword;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.ChangeAdminPassword.Commands;

public record ChangeAdminPasswordCommand(ChangeAdminPasswordParamDto Param) : IRequest<ResultInfo>;

public class ChangeAdminPasswordCommandHandler(
    IDynamicRepository repository,
    ILogger<ChangeAdminPasswordCommandHandler> logger)
    : IRequestHandler<ChangeAdminPasswordCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        ChangeAdminPasswordCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = new
            {
                CustId = request.Param.UserId,
                OldPwd = request.Param.OldPassword,
                NewPwd = request.Param.NewPassword,
                request.Param.UserId,
                request.Param.Ip
            };

            var result = await repository.ExecuteAsync(param);
            return result > 0
                ? ResultInfo.GenerateSuccess("Password changed successfully.")
                : ResultInfo.GenerateErr("Failed to change password. Please check your old password.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error changing admin password");
            return ResultInfo.GenerateErr($"Error changing password: {ex.Message}");
        }
    }
}

