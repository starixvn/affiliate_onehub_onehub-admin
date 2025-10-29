using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.SubAffDomain.Commands;

public record DeleteSubAffDomainCommand(DeleteDomainParamDto Param) : IRequest<ResultInfo>;

public class DeleteSubAffDomainCommandHandler(
    IDynamicRepository repository,
    ILogger<DeleteSubAffDomainCommandHandler> logger)
    : IRequestHandler<DeleteSubAffDomainCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        DeleteSubAffDomainCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Sub-Affiliate domain delete failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting sub-affiliate domain: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error deleting sub-affiliate domain");
        }
    }
}

