using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Domains.Commands;

public record UpdateDomainCommand(UpdateDomainParamDto Param) : IRequest<ResultInfo>;

public class UpdateDomainCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateDomainCommandHandler> logger)
    : IRequestHandler<UpdateDomainCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateDomainCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var spKey = request.Param.IsAffDomain
                ? "Aff_Admin_AffiliateDomain_Upd"
                : "Aff_Admin_LicenseeDomain_Upd";

            var commandParam = new
            {
                SpKey = spKey,
                request.Param.DomainId,
                request.Param.DomainName,
                request.Param.BlockTargetCountry,
                request.Param.IsSSL,
                request.Param.UserId,
                request.Param.Ip
            };

            var rowsAffected = await repository.ExecuteAsync(commandParam);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Domain update failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating domain: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error updating domain");
        }
    }
}

