using ONEHub.Domain.Entities;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface ISystemRepository
{
    Task<Result<IEnumerable<TargetCountry>>> GetTargetCountryAsync(bool isDefault = true, string targetCountryCode = "");
}
