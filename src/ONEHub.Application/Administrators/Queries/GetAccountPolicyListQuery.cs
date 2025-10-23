using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Criterias.Administrators;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Administrators.Queries;

public record GetAccountPolicyListQuery(int AccountId) : IRequest<IEnumerable<PolicyInfoDto>>;

public class GetAccountPolicyListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetAccountPolicyListQueryHandler> logger)
    : IRequestHandler<GetAccountPolicyListQuery, IEnumerable<PolicyInfoDto>>
{
    public async Task<IEnumerable<PolicyInfoDto>> Handle(
        GetAccountPolicyListQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new AccountPolicyCriteria { CustId = request.AccountId };
        var results = await repository.FetchAsync<PolicyInfoDto>(criteria);
        return results.Where(p => !p.FuncDesc.Contains("Transfer Balance For Player"));
    }
}

