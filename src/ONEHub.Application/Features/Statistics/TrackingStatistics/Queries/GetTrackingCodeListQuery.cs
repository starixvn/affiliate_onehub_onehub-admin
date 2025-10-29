using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Statistics.TrackingStatistics.Queries;

public record GetTrackingCodeListQuery(int AffId) : IRequest<IEnumerable<string>>;

public class GetTrackingCodeListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetTrackingCodeListQueryHandler> logger)
    : IRequestHandler<GetTrackingCodeListQuery, IEnumerable<string>>
{
    public async Task<IEnumerable<string>> Handle(
        GetTrackingCodeListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<TrackingInfoDto>(new { request.AffId });
        return results.Select(t => t.TrackingCode).ToList();
    }
}

