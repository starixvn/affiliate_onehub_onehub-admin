using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.DomainControl.Commands;

public record DeleteDomainControlCommand(DeleteDomainControlParamDto Param) : IRequest<ResultInfo>;

public class DeleteDomainControlCommandHandler(
    IDynamicRepository repository,
    ILogger<DeleteDomainControlCommandHandler> logger)
    : IRequestHandler<DeleteDomainControlCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        DeleteDomainControlCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Domain control delete failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting domain control: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error deleting domain control");
        }
    }
}

