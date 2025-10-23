using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.ValueObjects;

namespace ONEHub.Application.CommonDomain.Commands;

public record InsertDomainCommand(InsertDomainParamDto Param, string SpKey) : IRequest<ResultInfo>;

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
            var param = new
            {
                request.Param.DomainName,
                request.Param.IsSSL,
                request.Param.BlockTargetCountry,
                request.Param.UserId,
                request.Param.Ip,
                SpKey = request.SpKey
            };

            var result = await repository.ExecuteAsync(param);
            return result > 0
                ? ResultInfo.GenerateSuccess("Domain inserted successfully.")
                : ResultInfo.GenerateErr("Failed to insert domain.");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error inserting domain");
            return ResultInfo.GenerateErr($"Error inserting domain: {ex.Message}");
        }
    }
}

