using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;
using InsertCommand = ONEHub.Domain.Commands.LandingPages.InsertLandingPageDealCommand;

namespace ONEHub.Application.Features.LandingPages.PageBuilder.Commands;

public record InsertLandingPageDealCommand(
    int PageId,
    int CampaignId,
    int UserId,
    string Ip) : IRequest<ResultInfo>;

public class InsertLandingPageDealCommandHandler(
    IDynamicRepository repository,
    ILogger<InsertLandingPageDealCommandHandler> logger)
    : IRequestHandler<InsertLandingPageDealCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        InsertLandingPageDealCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new InsertCommand
            {
                DealId = request.CampaignId
            };

            var rowsAffected = await repository.ExecuteAsync(command);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Insert landing page deal failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error inserting landing page deal. PageId: {PageId}, CampaignId: {CampaignId}",
                request.PageId, request.CampaignId);
            return ResultInfo.GenerateError("Error inserting landing page deal");
        }
    }
}

