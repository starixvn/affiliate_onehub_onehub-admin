using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Reports;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Reports.Queries;

public record GetAffiliateMainReportQuery(AffiliateReportParamDto Param)
    : IRequest<EntityResult<AffiliateReportDto>>;

public class GetAffiliateMainReportQueryHandler(
    IDynamicRepository repository,
    ILogger<GetAffiliateMainReportQueryHandler> logger)
    : IRequestHandler<GetAffiliateMainReportQuery, EntityResult<AffiliateReportDto>>
{
    private const int ValidMonthArrange = 5;
    private const int ValidDateArrange = 6;

    public async Task<EntityResult<AffiliateReportDto>> Handle(
        GetAffiliateMainReportQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = request.Param;

            if (!IsValidParam(param))
            {
                logger.LogWarning("Invalid report parameters");
                return new EntityResult<AffiliateReportDto>();
            }

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
            logger.LogError(ex, "Error fetching affiliate main report");
            return new EntityResult<AffiliateReportDto>();
        }
    }

    private static bool IsValidParam(AffiliateReportParamDto param)
    {
        return !string.IsNullOrEmpty(param.ProductIds) &&
               IsValidDateRange(param.FromDate, param.ToDate, param.IsGetMonthly);
    }

    private static bool IsValidDateRange(DateTime from, DateTime to, bool isGetMonthly = true)
    {
        var maxMonth = from.AddMonths(isGetMonthly ? ValidMonthArrange : ValidDateArrange);
        return DateTime.Compare(maxMonth, to) >= 0;
    }
}

