using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Criterias;

namespace ONEHub.Infrastructure.Repositories;

public class LandingPageRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), ILandingPageRepository
{
    public async Task<Result<IEnumerable<LandingPageOption>>> GetLandingPageOptionsAsync()
    {
        var criteria = new GetLandingPageDropdownCriteria();

        return await FetchDataAsync<LandingPageOption>(criteria);
    }
}

