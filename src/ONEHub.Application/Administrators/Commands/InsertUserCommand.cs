using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Administrators.Commands;

public record InsertUserCommand(InsertUserParamDto Param) : IRequest<ResultInfo>;

public class InsertUserCommandHandler(
    IDynamicRepository repository,
    ILogger<InsertUserCommandHandler> logger)
    : IRequestHandler<InsertUserCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        InsertUserCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("User insert failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error inserting user: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error inserting user");
        }
    }
}

