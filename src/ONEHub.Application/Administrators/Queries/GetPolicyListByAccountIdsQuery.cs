using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Administrators.Queries;

public record GetPolicyListByAccountIdsQuery(string AccountIds) : IRequest<IEnumerable<PolicyInfoDto>>;

public class GetPolicyListByAccountIdsQueryHandler(
    IDynamicRepository repository,
    ILogger<GetPolicyListByAccountIdsQueryHandler> logger)
    : IRequestHandler<GetPolicyListByAccountIdsQuery, IEnumerable<PolicyInfoDto>>
{
    public async Task<IEnumerable<PolicyInfoDto>> Handle(
        GetPolicyListByAccountIdsQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<PolicyInfoDto>(new { CustIds = request.AccountIds });
        return results.Where(p => !p.FuncDesc.Contains("Transfer Balance For Player"));
    }
}

