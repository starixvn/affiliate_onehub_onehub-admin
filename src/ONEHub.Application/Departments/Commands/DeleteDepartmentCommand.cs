using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.Departments.Commands;

public record DeleteDepartmentCommand(DeleteDepartmentParamDto Param) : IRequest<ResultInfo>;

public class DeleteDepartmentCommandHandler(
    IDynamicRepository repository,
    ILogger<DeleteDepartmentCommandHandler> logger)
    : IRequestHandler<DeleteDepartmentCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        DeleteDepartmentCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = new
            {
                GroupId = request.Param.DepartmentId,
                request.Param.UserId,
                request.Param.Ip
            };

            var result = await repository.ExecuteAsync(param);
            return result > 0
                ? ResultInfo.GenerateSuccess("Department deleted successfully.")
                : ResultInfo.GenerateErr("Failed to delete department.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting department");
            return ResultInfo.GenerateErr($"Error deleting department: {ex.Message}");
        }
    }
}

