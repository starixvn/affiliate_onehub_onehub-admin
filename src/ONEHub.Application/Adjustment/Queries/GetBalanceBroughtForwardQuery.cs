using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Adjustment.Queries;

public record GetBalanceBroughtForwardQuery(int AffId) : IRequest<decimal>;

public class GetBalanceBroughtForwardQueryHandler(
    IDynamicRepository repository,
    ILogger<GetBalanceBroughtForwardQueryHandler> logger)
    : IRequestHandler<GetBalanceBroughtForwardQuery, decimal>
{
    public async Task<decimal> Handle(
        GetBalanceBroughtForwardQuery request,
        CancellationToken cancellationToken)
    {
        var result = await repository.FetchAsync<dynamic>(new { AffId = request.AffId });
        var firstResult = result.FirstOrDefault();

        if (firstResult != null)
        {
            if (firstResult is IDictionary<string, object> dict && dict.ContainsKey("BalBroughtForward"))
            {
                return Convert.ToDecimal(dict["BalBroughtForward"]);
            }
        }

        return 0m;
    }
}

