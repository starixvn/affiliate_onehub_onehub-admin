using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Application.DTOs.UserPanel.Statistics;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Statistics.LandingPageStatistics.Queries;

public record GetLandingPageStatisticsListQuery(LandingPageStatisticsParamDto Param) : IRequest<IEnumerable<LandingPageStatisticsDto>>;

public class GetLandingPageStatisticsListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetLandingPageStatisticsListQueryHandler> logger)
    : IRequestHandler<GetLandingPageStatisticsListQuery, IEnumerable<LandingPageStatisticsDto>>
{
    public async Task<IEnumerable<LandingPageStatisticsDto>> Handle(
        GetLandingPageStatisticsListQuery request,
        CancellationToken cancellationToken)
    {
        var param = new
        {
            request.Param.AffId,
            request.Param.FromDate,
            request.Param.ToDate,
            SportCode = request.Param.SelectedPage,
            request.Param.LanguageCode,
            request.Param.DeviceType
        };

        var results = await repository.FetchAsync<LandingPageStatisticsDto>(param);
        return results.ToList();
    }
}

