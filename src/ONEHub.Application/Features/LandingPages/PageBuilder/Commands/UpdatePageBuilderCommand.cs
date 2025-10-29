using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;
using UpdateCommand = ONEHub.Domain.Commands.LandingPages.UpdatePageBuilderCommand;

namespace ONEHub.Application.Features.LandingPages.PageBuilder.Commands;

public record UpdatePageBuilderCommand(
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

public class UpdatePageBuilderCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdatePageBuilderCommandHandler> logger)
    : IRequestHandler<UpdatePageBuilderCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdatePageBuilderCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new UpdateCommand
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
                : ResultInfo.GenerateError("Update page builder failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating page builder. PageId: {PageId}, PageName: {PageName}",
                request.PageId, request.PageName);
            return ResultInfo.GenerateError("Error updating page builder");
        }
    }
}

