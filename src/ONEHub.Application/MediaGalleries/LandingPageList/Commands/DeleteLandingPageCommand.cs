using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.MediaGalleries;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.MediaGalleries.LandingPageList.Commands;

public record DeleteLandingPageCommand(DeleteLandingPageParamDto Param) : IRequest<ResultInfo>;

public class DeleteLandingPageCommandHandler(
    IDynamicRepository repository,
    ILogger<DeleteLandingPageCommandHandler> logger)
    : IRequestHandler<DeleteLandingPageCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        DeleteLandingPageCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Delete landing page failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting landing page: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error deleting landing page");
        }
    }
}

