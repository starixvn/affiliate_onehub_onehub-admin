using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.PageManagement.Commands;

public class UpdateBatchLandingPageStatusCommand : BaseNonResultCommand
{
    public string PageIds { get; set; } = string.Empty;

    public int StatusId { get; set; }
}

public class UpdateBatchLandingPageStatusHandler(
    IPageManagementRepository pageManagementRepository)
    : IRequestHandler<UpdateBatchLandingPageStatusCommand, Result>
{
    public async Task<Result> Handle(UpdateBatchLandingPageStatusCommand request, CancellationToken cancellationToken)
    {
        var param = new UpdateBatchLandingPageStatusParam
        {
            PageIds = request.PageIds,
            StatusId = request.StatusId,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host
        };

        var result = await pageManagementRepository.UpdateBatchLandingPageStatusAsync(param);
        return result;
    }
}
