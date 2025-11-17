using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Link.Queries;

public class GetLinkDashboardQuery : BaseQuery<LinkDashboardResponse>
{
    public string? Search { get; set; } = string.Empty;

    public string? CountryCodes { get; set; } = string.Empty;

    public string? ChannelIds { get; set; } = string.Empty;

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }
}

public record LinkDashboardResponse(
    int TotalLinks,
    int UniqueClicks,
    int TotalRegistrations,
    int TotalFtds,
    decimal AvgFtdAmount);

public class GetLinkDashboardHandler(ILinkRepository linkRepository)
    : IRequestHandler<GetLinkDashboardQuery, Result<LinkDashboardResponse>>
{
    public async Task<Result<LinkDashboardResponse>> Handle(GetLinkDashboardQuery request, CancellationToken cancellationToken)
    {
        var param = new LinkDashboardParam
        {
            Search = request.Search,
            CountryCodes = request.CountryCodes,
            ChannelIds = request.ChannelIds,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };

        var linkDashboardResult = await linkRepository.GetLinkDashboardAsync(param);

        if (linkDashboardResult.IsFailure)
        {
            return Result<LinkDashboardResponse>.Failure(linkDashboardResult.Error);
        }

        if (linkDashboardResult.Data is null)
        {
            return Result<LinkDashboardResponse>.Failure(Error.NoData);
        }

        var data = new LinkDashboardResponse(
            linkDashboardResult.Data.TotalLinks,
            linkDashboardResult.Data.UniqueClicks,
            linkDashboardResult.Data.TotalRegistrations,
            linkDashboardResult.Data.TotalFtds,
            linkDashboardResult.Data.AvgFTDs
        );

        return Result<LinkDashboardResponse>.Success(data);
    }
}

