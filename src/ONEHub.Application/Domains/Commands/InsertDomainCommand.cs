using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Domains.Commands;

public record InsertDomainCommand(InsertDomainParamDto Param) : IRequest<ResultInfo>;

public class InsertDomainCommandHandler(
    IDynamicRepository repository,
    ILogger<InsertDomainCommandHandler> logger)
    : IRequestHandler<InsertDomainCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        InsertDomainCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var spKey = request.Param.IsAffDomain
                ? "Aff_Admin_AffiliateDomain_Ins"
                : "Aff_Admin_LicenseeDomain_Ins";

            var commandParam = new
            {
                SpKey = spKey,
                request.Param.DomainName,
                request.Param.BlockTargetCountry,
                request.Param.IsSSL,
                request.Param.UserId,
                request.Param.Ip
            };

            var rowsAffected = await repository.ExecuteAsync(commandParam);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Domain insert failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error inserting domain: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error inserting domain");
        }
    }
}

