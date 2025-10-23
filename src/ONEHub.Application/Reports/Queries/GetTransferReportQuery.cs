using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Reports;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Reports.Queries;

public record GetTransferReportQuery(TransferReportParamDto Param)
    : IRequest<EntityResult<TransferReportDto>>;

public class GetTransferReportQueryHandler(
    IDynamicRepository repository,
    ILogger<GetTransferReportQueryHandler> logger)
    : IRequestHandler<GetTransferReportQuery, EntityResult<TransferReportDto>>
{
    private const int MaxMonthsRange = 6;

    public async Task<EntityResult<TransferReportDto>> Handle(
        GetTransferReportQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var param = request.Param;

            if (!IsValidDateTime(param.FromDate, param.ToDate))
            {
                logger.LogWarning("Invalid date range for transfer report");
                return new EntityResult<TransferReportDto> { MainData = [] };
            }

            var results = await repository.FetchAsync<TransferReportDto>(param);
            var list = results.ToList();

            return new EntityResult<TransferReportDto>
            {
                MainData = list,
                TotalItem = list.Count,
                PageIndex = param.PageIndex,
                PageSize = param.PageSize
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching transfer report");
            return new EntityResult<TransferReportDto> { MainData = [] };
        }
    }

    private static bool IsValidDateTime(DateTime from, DateTime to)
    {
        if (from == DateTime.MinValue || to == DateTime.MinValue)
            return false;

        var maxDate = from.AddMonths(MaxMonthsRange);
        return DateTime.Compare(maxDate, to) >= 0;
    }
}

