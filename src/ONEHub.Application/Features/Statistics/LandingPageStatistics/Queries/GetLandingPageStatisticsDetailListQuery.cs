using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Application.DTOs.UserPanel.Statistics;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Statistics.LandingPageStatistics.Queries;

public record GetLandingPageStatisticsDetailListQuery(LandingPageStatisticsDetailParamDto Param) : IRequest<EntityResult<LandingPageStatisticsDto>>;

public class GetLandingPageStatisticsDetailListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetLandingPageStatisticsDetailListQueryHandler> logger)
    : IRequestHandler<GetLandingPageStatisticsDetailListQuery, EntityResult<LandingPageStatisticsDto>>
{
    public async Task<EntityResult<LandingPageStatisticsDto>> Handle(
        GetLandingPageStatisticsDetailListQuery request,
        CancellationToken cancellationToken)
    {
        var param = new
        {
            request.Param.AffId,
            request.Param.FromDate,
            request.Param.ToDate,
            SportCode = request.Param.SelectedPage,
            request.Param.LanguageCode,
            request.Param.DeviceType,
            request.Param.PageIndex,
            request.Param.PageSize
        };

        var results = await repository.FetchAsync<LandingPageStatisticsDto>(param);
        var list = results.ToList();

        return new EntityResult<LandingPageStatisticsDto>
        {
            MainData = list,
            TotalItem = list.Count,
            PageIndex = request.Param.PageIndex,
            PageSize = request.Param.PageSize
        };
    }
}

