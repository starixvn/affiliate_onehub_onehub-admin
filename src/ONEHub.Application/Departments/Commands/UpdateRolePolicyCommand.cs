using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.Departments.Commands;

public record UpdateRolePolicyCommand(UpdatePolicyParamDto Param) : IRequest<ResultInfo>;

public class UpdateRolePolicyCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateRolePolicyCommandHandler> logger)
    : IRequestHandler<UpdateRolePolicyCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateRolePolicyCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = new
            {
                GroupPolicys = request.Param.GroupPolicies,
                request.Param.UserId,
                request.Param.Ip
            };

            var result = await repository.ExecuteAsync(param);
            return result > 0
                ? ResultInfo.GenerateSuccess("Role policy updated successfully.")
                : ResultInfo.GenerateErr("Failed to update role policy.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating role policy");
            return ResultInfo.GenerateErr($"Error updating role policy: {ex.Message}");
        }
    }
}

