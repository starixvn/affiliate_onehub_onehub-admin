using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Criterias;

namespace ONEHub.Infrastructure.Repositories;

public class SystemRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), ISystemRepository
{
    public async Task<Result<IEnumerable<TargetCountry>>> GetTargetCountryAsync(bool isDefault = true, string targetCountryCode = "")
    {
        var criteria = new GetTargetCountryCriteria(isDefault, targetCountryCode);
        return await FetchDataAsync<TargetCountry>(criteria);
    }
}
