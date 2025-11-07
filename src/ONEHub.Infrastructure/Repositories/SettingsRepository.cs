using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Criterias;

namespace ONEHub.Infrastructure.Repositories;

public class SettingsRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), ISettingsRepository
{
    public async Task<Result<IEnumerable<TargetCountry>>> GetTargetCountryListAsync()
    {
        var criteria = new GetTargetCountryCriteria
        {
            IsDefault = true,
        };

        return await FetchDataAsync<TargetCountry>(criteria);
    }

    public async Task<Result<IEnumerable<Market>>> GetLanguagesAsync()
    {
        var criteria = new GetMarketListCriteria();

        return await FetchDataAsync<Market>(criteria);
    }
}
