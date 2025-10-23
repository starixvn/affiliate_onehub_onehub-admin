using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;
using DomainCommand = ONEHub.Domain.Commands.Campaigns.InsertCampaignCommand;

namespace ONEHub.Application.LandingPages.PageBuilder.Commands;

public record InsertLandingPageCampaignCommand(DomainCommand Command) : IRequest<ResultInfo>;

public class InsertLandingPageCampaignCommandHandler(
    IDynamicRepository repository,
    ILogger<InsertLandingPageCampaignCommandHandler> logger)
    : IRequestHandler<InsertLandingPageCampaignCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        InsertLandingPageCampaignCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Command);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Insert landing page campaign failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error inserting landing page campaign: {@Command}", request.Command);
            return ResultInfo.GenerateError("Error inserting landing page campaign");
        }
    }
}

