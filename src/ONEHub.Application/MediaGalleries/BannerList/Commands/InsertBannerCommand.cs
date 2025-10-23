using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.MediaGalleries;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.MediaGalleries.BannerList.Commands;

public record InsertBannerCommand(InsertUpdateMultipleBannersParamDto Param) : IRequest<ResultInfo>;

public class InsertBannerCommandHandler(
    IDynamicRepository repository,
    ILogger<InsertBannerCommandHandler> logger)
    : IRequestHandler<InsertBannerCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        InsertBannerCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var rowsAffected = await repository.ExecuteAsync(request.Param);

            return rowsAffected > 0
                ? ResultInfo.Success
                : ResultInfo.GenerateError("Insert banner failed");
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error inserting banner: {@Param}", request.Param);
            return ResultInfo.GenerateError("Error inserting banner");
        }
    }
}

