using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.CommonDomain.Commands;

public record DeleteDomainCommand(DeleteDomainParamDto Param, string SpKey) : IRequest<ResultInfo>;

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
            var param = new
            {
                request.Param.DomainId,
                request.Param.UserId,
                request.Param.Ip,
                SpKey = request.SpKey
            };

            var result = await repository.ExecuteAsync(param);
            return result > 0
                ? ResultInfo.GenerateSuccess("Domain deleted successfully.")
                : ResultInfo.GenerateErr("Failed to delete domain.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting domain");
            return ResultInfo.GenerateErr($"Error deleting domain: {ex.Message}");
        }
    }
}

