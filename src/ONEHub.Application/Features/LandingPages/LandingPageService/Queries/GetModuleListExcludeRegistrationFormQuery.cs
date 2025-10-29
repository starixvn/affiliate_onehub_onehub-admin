using MediatR;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.LandingPages.LandingPageService.Queries;

public record GetModuleListExcludeRegistrationFormQuery : IRequest<IEnumerable<ModuleInfo>>;

public class GetModuleListExcludeRegistrationFormQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetModuleListExcludeRegistrationFormQuery, IEnumerable<ModuleInfo>>
{
    public async Task<IEnumerable<ModuleInfo>> Handle(
        GetModuleListExcludeRegistrationFormQuery request,
        CancellationToken cancellationToken)
    {
        var allModules = await repository.FetchAsync<ModuleInfo>(new GetModuleCriteria());
        return allModules.Where(m => m.ModuleId != LandingPageConstants.ModuleIds.RegistrationForm);
    }
}

