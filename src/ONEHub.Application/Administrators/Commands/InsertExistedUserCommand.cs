using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Administrators.Commands;

public record InsertExistedUserCommand(InsertExistedUserParamDto Param) : IRequest<ResultInfo>;

public class InsertExistedUserCommandHandler(
    IDynamicRepository repository,
    ILogger<InsertExistedUserCommandHandler> logger)
    : IRequestHandler<InsertExistedUserCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        InsertExistedUserCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Existed user insert failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error inserting existed user: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error inserting existed user");
        }
    }
}

