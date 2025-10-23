using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Reports;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Reports.Queries;

public record GetRedepositCpaReportQuery(RedepositCpaReportParamDto Param)
    : IRequest<EntityResult<RedepositCpaReportDto>>;

public class GetRedepositCpaReportQueryHandler(
    IDynamicRepository repository,
    ILogger<GetRedepositCpaReportQueryHandler> logger)
    : IRequestHandler<GetRedepositCpaReportQuery, EntityResult<RedepositCpaReportDto>>
{
    private const int MaxDaysRange = 180;

    public async Task<EntityResult<RedepositCpaReportDto>> Handle(
        GetRedepositCpaReportQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = request.Param;

            if (!IsValidDateRange(param.FromDate, param.ToDate))
            {
                logger.LogWarning("Invalid date range for redeposit CPA report");
                return new EntityResult<RedepositCpaReportDto>();
            }

            var results = await repository.FetchAsync<RedepositCpaReportDto>(param);
            var list = results.ToList();

            return new EntityResult<RedepositCpaReportDto>
            {
                MainData = list,
                TotalItem = list.FirstOrDefault()?.RowIdx ?? 0,
                PageIndex = param.PageIndex,
                PageSize = param.PageSize
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching redeposit CPA report");
            return new EntityResult<RedepositCpaReportDto>();
        }
    }

    private static bool IsValidDateRange(DateTime from, DateTime to)
    {
        var maxDate = from.AddDays(MaxDaysRange);
        return DateTime.Compare(maxDate, to) >= 0;
    }
}

