using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Statistics.TrackingStatistics.Queries;

public record GetTrackingStatisticsListQuery(TrackingStatisticsParamDto Param) : IRequest<IEnumerable<TrackingStatisticsDto>>;

public class GetTrackingStatisticsListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetTrackingStatisticsListQueryHandler> logger)
    : IRequestHandler<GetTrackingStatisticsListQuery, IEnumerable<TrackingStatisticsDto>>
{
    public async Task<IEnumerable<TrackingStatisticsDto>> Handle(
        GetTrackingStatisticsListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<TrackingStatisticsDto>(request.Param);
        return results.ToList();
    }
}

