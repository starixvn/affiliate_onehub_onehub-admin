using MediatR;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.LandingPages.LandingPageService.Queries;

public record GetModuleListQuery : IRequest<IEnumerable<ModuleInfo>>;

public class GetModuleListQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetModuleListQuery, IEnumerable<ModuleInfo>>
{
    public async Task<IEnumerable<ModuleInfo>> Handle(
        GetModuleListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<ModuleInfo>(new GetModuleCriteria());
        return results;
    }
}

