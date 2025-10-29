using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.MediaGalleries;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.MediaGalleries.LandingPageList.Commands;

public record HandleSaveLandingPageCommand(InsertUpdateLandingPageParamDto Param, bool IsInsert = false) : IRequest<ResultInfo>;

public class HandleSaveLandingPageCommandHandler(
    IDynamicRepository repository,
    ILogger<HandleSaveLandingPageCommandHandler> logger)
    : IRequestHandler<HandleSaveLandingPageCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        HandleSaveLandingPageCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError(request.IsInsert ? "Insert landing page failed" : "Update landing page failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error saving landing page: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error saving landing page");
        }
    }
}

