using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;
using InsertCommand = ONEHub.Domain.Commands.LandingPages.InsertPageBuilderCommand;

namespace ONEHub.Application.LandingPages.PageBuilder.Commands;

public record InsertPageBuilderCommand(
    int PageId,
    int CampaignId,
    string PageName,
    string PageCode,
    string DealIds,
    int StatusId,
    string TargetCountryCode,
    string LanguageCode,
    string ComponentStructure,
    bool IsPreview,
    int UserId,
    string Ip) : IRequest<ResultInfo>;

public class InsertPageBuilderCommandHandler(
    IDynamicRepository repository,
    ILogger<InsertPageBuilderCommandHandler> logger)
    : IRequestHandler<InsertPageBuilderCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        InsertPageBuilderCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new InsertCommand
            {
                PageId = request.PageId,
                CampaignId = request.CampaignId,
                PageName = request.PageName,
                PageCode = request.PageCode,
                DealIds = request.DealIds,
                StatusId = request.StatusId,
                TargetCountryCode = request.TargetCountryCode,
                LanguageCode = request.LanguageCode,
                ComponentStructure = request.ComponentStructure,
                IsPreview = request.IsPreview
            };

            var rowsAffected = await repository.ExecuteAsync(command);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Insert page builder failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error inserting page builder. PageName: {PageName}, CampaignId: {CampaignId}",
                request.PageName, request.CampaignId);
            return ResultInfo.GenerateError("Error inserting page builder");
        }
    }
}

