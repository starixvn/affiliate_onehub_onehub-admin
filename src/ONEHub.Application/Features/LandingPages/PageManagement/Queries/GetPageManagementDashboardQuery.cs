using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.PageManagement.Queries;

public class GetPageManagementDashboardQuery : BaseQuery<PageManagementDashboardResponse>
{
}

public record PageManagementDashboardResponse(int Total, int Draft, int Active, int Inactive);

public class GetPageManagementDashboardHandler(IPageManagementRepository pageManagementRepository)
    : IRequestHandler<GetPageManagementDashboardQuery, Result<PageManagementDashboardResponse>>
{
    public async Task<Result<PageManagementDashboardResponse>> Handle(GetPageManagementDashboardQuery request, CancellationToken cancellationToken)
    {
        var pageManagementDashboardResult = await pageManagementRepository.GetPageManagementDashboardAsync();

        if (pageManagementDashboardResult.IsFailure)
        {
            return Result<PageManagementDashboardResponse>.Failure(pageManagementDashboardResult.Error);
        }

        if (pageManagementDashboardResult.Data is null)
        {
            return Result<PageManagementDashboardResponse>.Failure(Error.NoData);
        }

        var data = new PageManagementDashboardResponse(
            pageManagementDashboardResult.Data.TotalPageBuilders,
            pageManagementDashboardResult.Data.DraftPageBuilders,
            pageManagementDashboardResult.Data.ActivePageBuilders,
            pageManagementDashboardResult.Data.InactivePageBuilders
        );

        return Result<PageManagementDashboardResponse>.Success(data);
    }
}
