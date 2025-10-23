using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Customer;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.CustomerLeftPanel.Queries;

public record GetOnlineListQuery(string AffUserName) : IRequest<IEnumerable<OnlineListDto>>;

public class GetOnlineListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetOnlineListQueryHandler> logger)
    : IRequestHandler<GetOnlineListQuery, IEnumerable<OnlineListDto>>
{
    public async Task<IEnumerable<OnlineListDto>> Handle(
        GetOnlineListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<OnlineListDto>(new { Username = request.AffUserName });
        return results.ToList();
    }
}

