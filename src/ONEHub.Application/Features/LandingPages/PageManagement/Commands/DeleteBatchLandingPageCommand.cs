using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.PageManagement.Commands;

public class DeleteBatchLandingPageCommand : BaseNonResultCommand
{
    public string PageIds { get; set; } = string.Empty;
}

public class DeleteBatchLandingPageHandler(
    IPageManagementRepository pageManagementRepository)
    : IRequestHandler<DeleteBatchLandingPageCommand, Result>
{
    public async Task<Result> Handle(DeleteBatchLandingPageCommand request, CancellationToken cancellationToken)
    {
        var param = new DeleteBatchLandingPageParam
        {
            PageIds = request.PageIds,
            UserId = request.UserId,
            Ip = request.Ip,
            Host = request.Host
        };

        var result = await pageManagementRepository.DeleteBatchLandingPageAsync(param);
        return result;
    }
}
