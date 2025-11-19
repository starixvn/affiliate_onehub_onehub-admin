using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.PageManagement.Queries;

public class GetPageManagementDashboardQuery : BaseQuery<PageManagementDashboardResponse>
{
    public string? Search { get; set; }

    public string? StatusIds { get; set; }

    public string? CountryCodes { get; set; }

    public string? LanguageCodes { get; set; }

    public DateTime? FromDate { get; set; }

    public DateTime? ToDate { get; set; }
}

public record PageManagementDashboardResponse(int Total, int Draft, int Active, int Inactive);

public class GetPageManagementDashboardHandler(IPageManagementRepository pageManagementRepository)
    : IRequestHandler<GetPageManagementDashboardQuery, Result<PageManagementDashboardResponse>>
{
    public async Task<Result<PageManagementDashboardResponse>> Handle(GetPageManagementDashboardQuery request, CancellationToken cancellationToken)
    {
        var param = new PageManagementDashboardParam
        {
            Search = request.Search,
            StatusIds = request.StatusIds,
            TargetCountryCodes = request.CountryCodes,
            LanguageCodes = request.LanguageCodes,
            FromDate = request.FromDate,
            ToDate = request.ToDate
        };
        var pageManagementDashboardResult = await pageManagementRepository.GetPageManagementDashboardAsync(param);

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
