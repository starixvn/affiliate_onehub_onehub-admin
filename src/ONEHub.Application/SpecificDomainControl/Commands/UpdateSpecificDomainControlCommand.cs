using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.SpecificDomainControl.Commands;

public record UpdateSpecificDomainControlCommand(UpdateSpecificDomainControlParamDto Param) : IRequest<ResultInfo>;

public class UpdateSpecificDomainControlCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateSpecificDomainControlCommandHandler> logger)
    : IRequestHandler<UpdateSpecificDomainControlCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateSpecificDomainControlCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Specific domain control update failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating specific domain control: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error updating specific domain control");
        }
    }
}

