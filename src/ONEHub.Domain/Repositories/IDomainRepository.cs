using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface IDomainRepository
{
    Task<Result<IEnumerable<DomainInfo>>> GetDomainListAsync(GetDomainParam param);
}

