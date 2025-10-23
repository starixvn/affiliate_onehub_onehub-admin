using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Application.DTOs.UserPanel.Statistics;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Statistics.MarketingStatistics.Queries;

public record GetMarketingStatisticsQuery(MarketingStatisticsParamDto Param) : IRequest<IEnumerable<MarketingStatisticsDto>>;

public class GetMarketingStatisticsQueryHandler(
    IDynamicRepository repository,
    ILogger<GetMarketingStatisticsQueryHandler> logger)
    : IRequestHandler<GetMarketingStatisticsQuery, IEnumerable<MarketingStatisticsDto>>
{
    public async Task<IEnumerable<MarketingStatisticsDto>> Handle(
        GetMarketingStatisticsQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<MarketingStatisticsDto>(request.Param);
        return results.ToList();
    }
}

