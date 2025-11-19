using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Criterias;

namespace ONEHub.Infrastructure.Repositories;

public class DomainRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), IDomainRepository
{
    public async Task<Result<IEnumerable<DomainInfo>>> GetDomainListAsync(GetDomainParam param)
    {
        var criteria = new GetDomainCriteria
        {
            CountryCode = param.CountryCode,
            DomainType = param.DomainType,
            SiteId = param.SiteId
        };

        return await FetchDataAsync<DomainInfo>(criteria);
    }
}

