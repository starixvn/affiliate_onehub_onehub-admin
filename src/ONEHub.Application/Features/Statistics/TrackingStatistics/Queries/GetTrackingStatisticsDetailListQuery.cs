using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Statistics.TrackingStatistics.Queries;

public record GetTrackingStatisticsDetailListQuery(TrackingStatisticsDetailParamDto Param) : IRequest<IEnumerable<TrackingStatisticsDto>>;

public class GetTrackingStatisticsDetailListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetTrackingStatisticsDetailListQueryHandler> logger)
    : IRequestHandler<GetTrackingStatisticsDetailListQuery, IEnumerable<TrackingStatisticsDto>>
{
    public async Task<IEnumerable<TrackingStatisticsDto>> Handle(
        GetTrackingStatisticsDetailListQuery request,
        CancellationToken cancellationToken)
    {
        var param = new
        {
            request.Param.AffId,
            request.Param.TrackingCode,
            request.Param.SelectedMonth.Month,
            request.Param.SelectedMonth.Year
        };

        var results = await repository.FetchAsync<TrackingStatisticsDto>(param);
        return results.ToList();
    }
}

