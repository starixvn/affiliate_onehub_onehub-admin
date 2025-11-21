using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.BaseMedia.Commands;

public class ToggleAssetStatusCommand : BaseNonResultCommand
{
    public string MediaIds { get; set; } = string.Empty;

    public int StatusId { get; set; }
}

public class ToggleAssetStatusCommandHandler(
    IAssetUploaderRepository assetUploaderRepository)
    : IRequestHandler<ToggleAssetStatusCommand, Result>
{
    public async Task<Result> Handle(
        ToggleAssetStatusCommand request,
        CancellationToken cancellationToken)
    {
        var param = new UpdateAssetStatusParam
        {
            MediaIds = request.MediaIds,
            StatusId = request.StatusId,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host
        };

        return await assetUploaderRepository.UpdateAssetStatusAsync(param);
    }
}

