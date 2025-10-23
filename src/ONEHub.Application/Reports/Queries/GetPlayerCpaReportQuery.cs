using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Reports;
using ONEHub.Domain.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Reports.Queries;

public record GetPlayerCpaReportQuery(PlayerCpaReportRequestDto Request)
    : IRequest<EntityResult<PlayerCpaReportDto>>;

public class GetPlayerCpaReportQueryHandler(
    IDynamicRepository repository,
    ILogger<GetPlayerCpaReportQueryHandler> logger)
    : IRequestHandler<GetPlayerCpaReportQuery, EntityResult<PlayerCpaReportDto>>
{
    public async Task<EntityResult<PlayerCpaReportDto>> Handle(
        GetPlayerCpaReportQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var req = request.Request;
            var results = await repository.FetchAsync<PlayerCpaReportDto>(req);
            var list = results.ToList();

            return new EntityResult<PlayerCpaReportDto>
            {
                MainData = list,
                TotalItem = list.Count,
                PageIndex = req.PageIndex,
                PageSize = req.PageSize
            };
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching player CPA report");
            return new EntityResult<PlayerCpaReportDto>();
        }
    }
}

