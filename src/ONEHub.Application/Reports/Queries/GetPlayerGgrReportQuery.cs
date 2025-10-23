using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Reports;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Reports.Queries;

public record GetPlayerGgrReportQuery(PlayerGgrReportParamDto Param)
    : IRequest<EntityResult<PlayerGgrReportDto>>;

public class GetPlayerGgrReportQueryHandler(
    IDynamicRepository repository,
    ILogger<GetPlayerGgrReportQueryHandler> logger)
    : IRequestHandler<GetPlayerGgrReportQuery, EntityResult<PlayerGgrReportDto>>
{
    private const int MaxMonthsRange = 6;
    private const int MaxPageSize = 2000;
    private const int MinPageSize = 1;

    public async Task<EntityResult<PlayerGgrReportDto>> Handle(
        GetPlayerGgrReportQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = request.Param;

            if (!IsValidDateRange(param.FromDate, param.ToDate))
            {
                logger.LogWarning("Invalid date range for player GGR report");
                return new EntityResult<PlayerGgrReportDto> { MainData = [] };
            }

            ValidatePaginationParameters(ref param);

            var results = await repository.FetchAsync<PlayerGgrReportDto>(param);
            var list = results.ToList();

            return new EntityResult<PlayerGgrReportDto>
            {
                MainData = list,
                TotalItem = list.Count,
                PageIndex = param.PageIndex,
                PageSize = param.PageSize
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching player GGR report. PageSize={PageSize}, PageIndex={PageIndex}",
                request.Param.PageSize, request.Param.PageIndex);
            return new EntityResult<PlayerGgrReportDto> { MainData = [] };
        }
    }

    private static bool IsValidDateRange(DateTime from, DateTime to)
    {
        if (from == DateTime.MinValue || to == DateTime.MinValue)
            return false;

        var maxDate = from.AddMonths(MaxMonthsRange);
        return DateTime.Compare(maxDate, to) >= 0;
    }

    private static void ValidatePaginationParameters(ref PlayerGgrReportParamDto param)
    {
        if (param.PageSize > MaxPageSize || param.PageSize < MinPageSize)
        {
            param.PageSize = MaxPageSize;
        }

        if (param.PageIndex < 1)
        {
            param.PageIndex = 1;
        }
    }
}

