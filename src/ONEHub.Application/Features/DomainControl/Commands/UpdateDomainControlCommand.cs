using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.DomainControl.Commands;

public record UpdateDomainControlCommand(UpdateDomainControlParamDto Param) : IRequest<ResultInfo>;

public class UpdateDomainControlCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateDomainControlCommandHandler> logger)
    : IRequestHandler<UpdateDomainControlCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateDomainControlCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var commandParam = new
            {
                request.Param.DomainControlId,
                request.Param.AffDomainId,
                LicenseeDomainId = request.Param.RedirectDomainId,
                request.Param.TargetCountryCode,
                request.Param.IsMobile,
                request.Param.IsExcluded,
                request.Param.DealIds,
                Status = request.Param.IsUsed,
                request.Param.UserId,
                request.Param.Ip
            };

            var rowsAffected = await repository.ExecuteAsync(commandParam);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Domain control update failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating domain control: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error updating domain control");
        }
    }
}

