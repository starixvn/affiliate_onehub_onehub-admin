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

    public async Task<Result<IEnumerable<TargetCountry>>> GetLanguagesByCountryAsync(string countryCode)
    {
        var criteria = new GetTargetCountryCriteria
        {
            IsDefault = true,
            TargetCountryCode = countryCode
        };

        return await FetchDataAsync<TargetCountry>(criteria);
    }
}
