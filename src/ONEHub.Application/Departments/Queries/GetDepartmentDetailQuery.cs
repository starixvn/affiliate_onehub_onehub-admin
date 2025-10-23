using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Administrators;
using ONEHub.Domain.Criterias.Administrators;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Departments.Queries;

public record GetDepartmentDetailQuery(int SelectedDepartmentId) : IRequest<DepartmentInfoDto>;

public class GetDepartmentDetailQueryHandler(
    IDynamicRepository repository,
    ILogger<GetDepartmentDetailQueryHandler> logger)
    : IRequestHandler<GetDepartmentDetailQuery, DepartmentInfoDto>
{
    public async Task<DepartmentInfoDto> Handle(
        GetDepartmentDetailQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new DepartmentDetailCriteria { GroupId = request.SelectedDepartmentId };
        var result = await repository.FetchAsync<DepartmentInfoDto>(criteria);
        return result.FirstOrDefault() ?? new DepartmentInfoDto();
    }
}

