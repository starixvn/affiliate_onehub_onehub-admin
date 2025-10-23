using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Members;
using ONEHub.Domain.Criterias.Members;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Members.Queries;

public record GetLatestBillingDateQuery : IRequest<DateTime>;

public class GetLatestBillingDateQueryHandler(
    IDynamicRepository repository,
    ILogger<GetLatestBillingDateQueryHandler> logger)
    : IRequestHandler<GetLatestBillingDateQuery, DateTime>
{
    public async Task<DateTime> Handle(
        GetLatestBillingDateQuery request,
        CancellationToken cancellationToken)
    {
        try
        {
            var criteria = new LatestBillingDateCriteria();
            var result = await repository.GetAsync<LatestBillingDateDto>(criteria);
            return result?.SValue ?? DateTime.Now;
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "Error fetching latest billing date");
            return DateTime.Now;
        }
    }
}

