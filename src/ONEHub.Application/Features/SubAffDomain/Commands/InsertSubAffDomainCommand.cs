using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.SubAffDomain.Commands;

public record InsertSubAffDomainCommand(InsertDomainParamDto Param) : IRequest<ResultInfo>;

public class InsertSubAffDomainCommandHandler(
    IDynamicRepository repository,
    ILogger<InsertSubAffDomainCommandHandler> logger)
    : IRequestHandler<InsertSubAffDomainCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        InsertSubAffDomainCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Sub-Affiliate domain insert failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error inserting sub-affiliate domain: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error inserting sub-affiliate domain");
        }
    }
}

