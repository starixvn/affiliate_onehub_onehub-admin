using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;
using DomainCommand = ONEHub.Domain.Commands.LandingPages.UpdateLandingPageStatusCommand;

namespace ONEHub.Application.LandingPages.PageManagement.Commands;

public record ToggleLandingPageStatusCommand(DomainCommand Command) : IRequest<ResultInfo>;

public class ToggleLandingPageStatusCommandHandler(
    IDynamicRepository repository,
    ILogger<ToggleLandingPageStatusCommandHandler> logger)
    : IRequestHandler<ToggleLandingPageStatusCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        ToggleLandingPageStatusCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Command);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Toggle landing page status failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error toggling landing page status: {@Command}", request.Command);
            return ResultInfo.GenerateError("Error toggling landing page status");
        }
    }
}

