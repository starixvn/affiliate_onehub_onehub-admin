using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Administrators.Commands;

public record UpdateAccountPolicyCommand(UpdatePolicyParamDto Param) : IRequest<ResultInfo>;

public class UpdateAccountPolicyCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateAccountPolicyCommandHandler> logger)
    : IRequestHandler<UpdateAccountPolicyCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateAccountPolicyCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Account policy update failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating account policy: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error updating account policy");
        }
    }
}

