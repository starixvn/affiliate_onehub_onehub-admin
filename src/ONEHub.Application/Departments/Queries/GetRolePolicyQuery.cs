using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Departments.Queries;

public record GetRolePolicyQuery(int DepartmentId) : IRequest<IEnumerable<PolicyInfoDto>>;

public class GetRolePolicyQueryHandler(
    IDynamicRepository repository,
    ILogger<GetRolePolicyQueryHandler> logger)
    : IRequestHandler<GetRolePolicyQuery, IEnumerable<PolicyInfoDto>>
{
    public async Task<IEnumerable<PolicyInfoDto>> Handle(
        GetRolePolicyQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<PolicyInfoDto>(new { GroupId = request.DepartmentId });
        return results.Where(p => !p.FuncDesc.Contains("Transfer Balance For Player")).ToList();
    }
}

