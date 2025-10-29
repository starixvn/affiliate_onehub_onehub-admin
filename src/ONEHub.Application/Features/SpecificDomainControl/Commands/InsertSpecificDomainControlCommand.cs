using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Domains;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.SpecificDomainControl.Commands;

public record InsertSpecificDomainControlCommand(InsertSpecificDomainControlParamDto Param) : IRequest<ResultInfo>;

public class InsertSpecificDomainControlCommandHandler(
    IDynamicRepository repository,
    ILogger<InsertSpecificDomainControlCommandHandler> logger)
    : IRequestHandler<InsertSpecificDomainControlCommand, ResultInfo>
{
    private const int MaximumAffiliatesNumber = 500;

    public async Task<ResultInfo> Handle(
        InsertSpecificDomainControlCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var affiliates = request.Param.AffUsername.Split(',', StringSplitOptions.RemoveEmptyEntries);
            if (affiliates.Length > MaximumAffiliatesNumber)
            {
                return ResultInfo.GenerateError(
                    $"The function can only create assignment for up to {MaximumAffiliatesNumber} affiliates per request!");
            }

            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Specific domain control insert failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error inserting specific domain control: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error inserting specific domain control");
        }
    }
}

