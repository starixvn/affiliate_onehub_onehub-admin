using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.Departments.Commands;

public record UpdateDepartmentCommand(InsertUpdateDepartmentParamDto Param) : IRequest<ResultInfo>;

public class UpdateDepartmentCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateDepartmentCommandHandler> logger)
    : IRequestHandler<UpdateDepartmentCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateDepartmentCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = new
            {
                GroupId = request.Param.DepartmentId,
                GroupName = request.Param.DepartmentName,
                GroupDesc = request.Param.Description,
                request.Param.UserId,
                request.Param.Ip
            };

            var result = await repository.ExecuteAsync(param);
            return result > 0
                ? ResultInfo.GenerateSuccess("Department updated successfully.")
                : ResultInfo.GenerateErr("Failed to update department.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating department");
            return ResultInfo.GenerateErr($"Error updating department: {ex.Message}");
        }
    }
}

