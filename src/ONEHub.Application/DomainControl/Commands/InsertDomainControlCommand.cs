using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.DomainControl.Commands;

public record InsertDomainControlCommand(InsertDomainControlParamDto Param) : IRequest<ResultInfo>;

public class InsertDomainControlCommandHandler(
    IDynamicRepository repository,
    ILogger<InsertDomainControlCommandHandler> logger)
    : IRequestHandler<InsertDomainControlCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        InsertDomainControlCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var commandParam = new
            {
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
                : ResultInfo.GenerateError("Domain control insert failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error inserting domain control: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error inserting domain control");
        }
    }
}

