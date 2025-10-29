using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.LandingPages;
using ONEHub.Domain.Common;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.LandingPages.PageManagement.Queries;

public record GetPageManagementListQuery(GetPageManagementCriteria Criteria) : IRequest<EntityResult<PageManagementDto>>;

public class GetPageManagementListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetPageManagementListQueryHandler> logger)
    : IRequestHandler<GetPageManagementListQuery, EntityResult<PageManagementDto>>
{
    public async Task<EntityResult<PageManagementDto>> Handle(
        GetPageManagementListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<PageManagementDto>(request.Criteria);
        var list = results.ToList();

        return new EntityResult<PageManagementDto>
        {
            MainData = list,
            TotalItem = list.Count,
            PageIndex = request.Criteria.PageIndex,
            PageSize = request.Criteria.PageSize
        };
    }
}

