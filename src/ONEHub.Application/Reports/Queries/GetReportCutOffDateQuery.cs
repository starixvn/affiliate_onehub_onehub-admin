using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Reports.Queries;

public record GetReportCutOffDateQuery : IRequest<DateTime>;

public class GetReportCutOffDateQueryHandler(
    IDynamicRepository repository,
    ILogger<GetReportCutOffDateQueryHandler> logger)
    : IRequestHandler<GetReportCutOffDateQuery, DateTime>
{
    public async Task<DateTime> Handle(
        GetReportCutOffDateQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var results = await repository.FetchAsync<dynamic>(new { });
            var firstResult = results.FirstOrDefault();
            if (firstResult != null)
            {
                return (DateTime)firstResult;
            }
            return DateTime.Now;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching report cut-off date");
            return DateTime.Now;
        }
    }
}

