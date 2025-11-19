using Fanex.Logging;
using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Application.Utils;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.AssetUploader.Commands;

public class ToggleAssetStatusCommand : BaseNonResultCommand
{
    public string MediaIds { get; set; } = string.Empty;

    public int StatusId { get; set; }
}

public class ToggleAssetStatusCommandHandler(
    IAssetUploaderRepository assetUploaderRepository,
    ILogger logger)
    : IRequestHandler<ToggleAssetStatusCommand, Result>
{
    public async Task<Result> Handle(
        ToggleAssetStatusCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = new UpdateAssetStatusParam
            {
                MediaIds = request.MediaIds,
                StatusId = request.StatusId,
                UserId = request.UserId,
                Ip = request.Ip,
                Host = request.Host
            };

            var result = await assetUploaderRepository.UpdateAssetStatusAsync(param);
            return result;
        }
        catch (Exception ex)
        {
            await logger.ErrorAsync(LoggerUtils.GenerateMessage(ex));
            return Result.Failure(AssetUploaderError.ChangeAssetStatusFailed);
        }
    }
}

