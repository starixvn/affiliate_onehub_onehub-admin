using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.MediaGalleries;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.MediaGalleries.BannerList.Commands;

public record UpdateBannerCommand(InsertUpdateMultipleBannersParamDto Param) : IRequest<ResultInfo>;

public class UpdateBannerCommandHandler(
    IDynamicRepository repository,
    ILogger<UpdateBannerCommandHandler> logger)
    : IRequestHandler<UpdateBannerCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        UpdateBannerCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Update banner failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error updating banner: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error updating banner");
        }
    }
}

