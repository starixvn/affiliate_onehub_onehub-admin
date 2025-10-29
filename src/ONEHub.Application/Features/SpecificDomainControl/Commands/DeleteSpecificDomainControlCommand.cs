using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.SpecificDomainControl.Commands;

public record DeleteSpecificDomainControlCommand(DeleteSpecificDomainControlParamDto Param) : IRequest<ResultInfo>;

public class DeleteSpecificDomainControlCommandHandler(
    IDynamicRepository repository,
    ILogger<DeleteSpecificDomainControlCommandHandler> logger)
    : IRequestHandler<DeleteSpecificDomainControlCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        DeleteSpecificDomainControlCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Specific domain control delete failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting specific domain control: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error deleting specific domain control");
        }
    }
}

