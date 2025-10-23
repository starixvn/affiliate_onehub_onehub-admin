using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.SubAffDomain.Commands;

public record UpdateSubAffDomainCommand(UpdateDomainParamDto Param) : IRequest<ResultInfo>;

public class UpdateSubAffDomainCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateSubAffDomainCommandHandler> logger)
    : IRequestHandler<UpdateSubAffDomainCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateSubAffDomainCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Sub-Affiliate domain update failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating sub-affiliate domain: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error updating sub-affiliate domain");
        }
    }
}

