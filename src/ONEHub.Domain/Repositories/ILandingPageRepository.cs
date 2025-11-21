using ONEHub.Domain.Entities;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface ILandingPageRepository
{
    Task<Result<IEnumerable<LandingPageOption>>> GetLandingPageOptionsAsync();

    Task<Result<IEnumerable<ModuleInfo>>> GetModuleAsync(string? moduleTypes = null);
}
