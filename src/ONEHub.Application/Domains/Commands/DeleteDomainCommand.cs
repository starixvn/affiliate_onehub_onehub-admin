using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Domains.Commands;

public record DeleteDomainCommand(DeleteDomainParamDto Param) : IRequest<ResultInfo>;

public class DeleteDomainCommandHandler(
    IDynamicRepository repository,
    ILogger<DeleteDomainCommandHandler> logger)
    : IRequestHandler<DeleteDomainCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        DeleteDomainCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var spKey = request.Param.IsAffDomain
                ? "Aff_Admin_AffiliateDomain_Del"
                : "Aff_Admin_LicenseeDomain_Del";

            var commandParam = new
            {
                SpKey = spKey,
                request.Param.DomainId,
                request.Param.UserId,
                request.Param.Ip
            };

            var rowsAffected = await repository.ExecuteAsync(commandParam);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Domain delete failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting domain: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error deleting domain");
        }
    }
}

