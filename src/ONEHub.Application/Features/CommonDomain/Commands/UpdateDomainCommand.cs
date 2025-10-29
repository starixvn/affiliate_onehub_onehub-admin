using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.Features.CommonDomain.Commands;

public record UpdateDomainCommand(UpdateDomainParamDto Param, string SpKey) : IRequest<ResultInfo>;

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
            var param = new
            {
                request.Param.DomainId,
                request.Param.DomainName,
                request.Param.IsSSL,
                request.Param.BlockTargetCountry,
                request.Param.UserId,
                request.Param.Ip,
                request.SpKey
            };

            var result = await repository.ExecuteAsync(param);
            return result > 0
                ? ResultInfo.GenerateSuccess("Domain updated successfully.")
                : ResultInfo.GenerateErr("Failed to update domain.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating domain");
            return ResultInfo.GenerateErr($"Error updating domain: {ex.Message}");
        }
    }
}

