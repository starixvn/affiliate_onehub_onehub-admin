using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Application.DTOs.UserPanel.Statistics;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Statistics.ReferrersStatistics.Queries;

public record GetReferrersListQuery(ReferrersParamDto Param) : IRequest<IEnumerable<ReferrersStatisticsDto>>;

public class GetReferrersListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetReferrersListQueryHandler> logger)
    : IRequestHandler<GetReferrersListQuery, IEnumerable<ReferrersStatisticsDto>>
{
    public async Task<IEnumerable<ReferrersStatisticsDto>> Handle(
        GetReferrersListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<ReferrersStatisticsDto>(request.Param);
        return results.ToList();
    }
}

