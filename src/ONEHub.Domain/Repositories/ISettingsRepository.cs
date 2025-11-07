using ONEHub.Domain.Entities;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface ISettingsRepository
{
    Task<Result<IEnumerable<TargetCountry>>> GetTargetCountryListAsync();

    Task<Result<IEnumerable<Market>>> GetLanguagesAsync();
}
