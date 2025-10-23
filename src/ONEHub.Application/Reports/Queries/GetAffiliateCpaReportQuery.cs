using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Reports;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Reports.Queries;

public record GetAffiliateCpaReportQuery(AffiliateCpaRequestDto Request)
    : IRequest<EntityResult<AffiliateCpaReportDto>>;

public class GetAffiliateCpaReportQueryHandler(
    IDynamicRepository repository,
    ILogger<GetAffiliateCpaReportQueryHandler> logger)
    : IRequestHandler<GetAffiliateCpaReportQuery, EntityResult<AffiliateCpaReportDto>>
{
    private const int MaxDaysRange = 180;

    public async Task<EntityResult<AffiliateCpaReportDto>> Handle(
        GetAffiliateCpaReportQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var req = request.Request;

            if (!IsValidDateRange(req.FromDate, req.ToDate))
            {
                logger.LogWarning("Invalid date range for CPA report");
                return new EntityResult<AffiliateCpaReportDto>();
            }

            var results = await repository.FetchAsync<AffiliateCpaReportDto>(req);
            var list = results.ToList();

            return new EntityResult<AffiliateCpaReportDto>
            {
                MainData = list,
                TotalItem = list.FirstOrDefault()?.AffId ?? 0,
                PageIndex = req.PageIndex,
                PageSize = req.PageSize
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching affiliate CPA report");
            return new EntityResult<AffiliateCpaReportDto>();
        }
    }

    private static bool IsValidDateRange(DateTime from, DateTime to)
    {
        var maxDate = from.AddDays(MaxDaysRange);
        return DateTime.Compare(maxDate, to) >= 0;
    }
}

