using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;
using ToggleCommand = ONEHub.Domain.Commands.LandingPages.UpdateAssetsStatusCommand;

namespace ONEHub.Application.Features.LandingPages.AssetUploader.Commands;

public record ToggleAssetStatusCommand(
    string MediaIds,
    int StatusId,
    int UserId,
    string Ip,
    string FunctionName) : IRequest<ResultInfo>;

public class ToggleAssetStatusCommandHandler(
    IDynamicRepository repository,
    ILogger<ToggleAssetStatusCommandHandler> logger)
    : IRequestHandler<ToggleAssetStatusCommand, ResultInfo>
{
    public async Task<ResultInfo> Handle(
        ToggleAssetStatusCommand request,
        CancellationToken cancellationToken)
    {
        try
        {
            var command = new ToggleCommand
            {
                MediaIds = request.MediaIds,
                StatusId = request.StatusId,
                UserId = request.UserId,
                Ip = request.Ip,
                FunctionName = request.FunctionName
            };

            await repository.ExecuteAsync(command);
            if (command.ErrCode != 0)
            {
                return ResultInfo.GenerateError(command.ErrMsg);
            }

            return ResultInfo.Success;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error toggling asset status: {@MediaIds}", request.MediaIds);
            return ResultInfo.GenerateError("Error toggling asset status");
        }
    }
}

