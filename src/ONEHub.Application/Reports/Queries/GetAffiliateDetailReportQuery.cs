using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Reports;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Reports.Queries;

public record GetAffiliateDetailReportQuery(AffiliateReportParamDto Param)
    : IRequest<EntityResult<AffiliateReportDto>>;

public class GetAffiliateDetailReportQueryHandler(
    IDynamicRepository repository,
    ILogger<GetAffiliateDetailReportQueryHandler> logger)
    : IRequestHandler<GetAffiliateDetailReportQuery, EntityResult<AffiliateReportDto>>
{
    public async Task<EntityResult<AffiliateReportDto>> Handle(
        GetAffiliateDetailReportQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = request.Param;
            var results = await repository.FetchAsync<AffiliateReportDto>(param);
            var list = results.ToList();

            return new EntityResult<AffiliateReportDto>
            {
                MainData = list,
                TotalItem = list.FirstOrDefault()?.AffId ?? 0,
                PageIndex = param.PageIndex,
                PageSize = param.PageSize
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching affiliate detail report");
            return new EntityResult<AffiliateReportDto>();
        }
    }
}

