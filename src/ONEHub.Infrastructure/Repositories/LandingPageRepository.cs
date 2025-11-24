using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Criterias;
using ONEHub.Infrastructure.Repositories.Criterias.LandingPages;

namespace ONEHub.Infrastructure.Repositories;

public class LandingPageRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), ILandingPageRepository
{
    public async Task<Result<IEnumerable<LandingPageOption>>> GetLandingPageOptionsAsync()
    {
        var criteria = new GetLandingPageDropdownCriteria();

        return await FetchDataAsync<LandingPageOption>(criteria);
    }

    public async Task<Result<IEnumerable<ModuleInfo>>> GetModuleAsync(string? moduleTypes = null)
    {
        var criteria = new GetModuleCriteria(moduleTypes);
        var result = await FetchDataAsync<ModuleInfo>(criteria);

        return result;
    }

    public async Task<Result<IEnumerable<StatusInfo>>> GetStatusAsync()
    {
        var criteria = new GetLandingPageStatusCriteria();
        var result = await FetchDataAsync<StatusInfo>(criteria);

        return result;
    }
}
