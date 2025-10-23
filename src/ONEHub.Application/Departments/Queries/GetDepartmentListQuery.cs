using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Criterias.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Departments.Queries;

public record GetDepartmentListQuery : IRequest<IEnumerable<DepartmentInfoDto>>;

public class GetDepartmentListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetDepartmentListQueryHandler> logger)
    : IRequestHandler<GetDepartmentListQuery, IEnumerable<DepartmentInfoDto>>
{
    public async Task<IEnumerable<DepartmentInfoDto>> Handle(
        GetDepartmentListQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new SimpleCriteria("Aff_Con_GroupInfoSel");
        var results = await repository.FetchAsync<DepartmentInfoDto>(criteria);
        return results.ToList();
    }
}

