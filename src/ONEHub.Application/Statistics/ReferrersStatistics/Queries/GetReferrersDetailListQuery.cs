using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.UserPanel;
using ONEHub.Application.DTOs.UserPanel.Statistics;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Statistics.ReferrersStatistics.Queries;

public record GetReferrersDetailListQuery(ReferrersDetailParamDto Param) : IRequest<EntityResult<ReferrersStatisticsDto>>;

public class GetReferrersDetailListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetReferrersDetailListQueryHandler> logger)
    : IRequestHandler<GetReferrersDetailListQuery, EntityResult<ReferrersStatisticsDto>>
{
    public async Task<EntityResult<ReferrersStatisticsDto>> Handle(
        GetReferrersDetailListQuery request,
        CancellationToken cancellationToken)
    {
        var param = new
        {
            request.Param.AffId,
            request.Param.FromDate,
            request.Param.ToDate,
            request.Param.DeviceType,
            Domain = request.Param.SelectedSiteUrl,
            request.Param.PageIndex,
            request.Param.PageSize
        };

        var results = await repository.FetchAsync<ReferrersStatisticsDto>(param);
        var list = results.ToList();

        return new EntityResult<ReferrersStatisticsDto>
        {
            MainData = list,
            TotalItem = list.Count,
            PageIndex = request.Param.PageIndex,
            PageSize = request.Param.PageSize
        };
    }
}

