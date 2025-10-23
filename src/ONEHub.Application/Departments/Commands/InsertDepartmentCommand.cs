using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.Departments.Commands;

public record InsertDepartmentCommand(InsertUpdateDepartmentParamDto Param) : IRequest<ResultInfo>;

public class InsertDepartmentCommandHandler(
    IDynamicRepository repository,
    ILogger<InsertDepartmentCommandHandler> logger)
    : IRequestHandler<InsertDepartmentCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        InsertDepartmentCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = new
            {
                GroupName = request.Param.DepartmentName,
                GroupDesc = request.Param.Description,
                request.Param.UserId,
                request.Param.Ip
            };

            var result = await repository.ExecuteAsync(param);
            return result > 0
                ? ResultInfo.GenerateSuccess("Department inserted successfully.")
                : ResultInfo.GenerateErr("Failed to insert department.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error inserting department");
            return ResultInfo.GenerateErr($"Error inserting department: {ex.Message}");
        }
    }
}

