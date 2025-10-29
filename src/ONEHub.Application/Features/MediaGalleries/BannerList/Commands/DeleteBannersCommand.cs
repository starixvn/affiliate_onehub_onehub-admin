using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.MediaGalleries;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.MediaGalleries.BannerList.Commands;

public record DeleteBannersCommand(DeleteBannerParamDto Param) : IRequest<ResultInfo>;

public class DeleteBannersCommandHandler(
    IDynamicRepository repository,
    ILogger<DeleteBannersCommandHandler> logger)
    : IRequestHandler<DeleteBannersCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        DeleteBannersCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Delete banners failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error deleting banners: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error deleting banners");
        }
    }
}

