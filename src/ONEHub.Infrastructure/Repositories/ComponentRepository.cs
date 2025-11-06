using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Criterias;

namespace ONEHub.Infrastructure.Repositories;

public class ComponentRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), IComponentRepository
{
    private readonly IDynamicRepository _dynamicRepository = dynamicRepository;

    public async Task<Result<List<ComponentSummary>>> GetComponentSummaryAsync()
    {
        var criteria = new GetComponentSummaryCriteria();
        var data = await _dynamicRepository.FetchAsync<ComponentSummary>(criteria);
        return Result<List<ComponentSummary>>.Success([.. data]);
    }

    public async Task<Result<PagingData<Component>>> GetComponentListAsync(ComponentListParam param)
    {
        var criteria = new GetComponentListCriteria
        {
            IsExportExcel = param.IsExportExcel,
            PageSize = param.PageSize,
            PageIndex = param.PageIndex,
            Search = param.Search,
            CategoryIds = param.CategoryIds,
            StatusIds = param.StatusIds,
            DeviceIds = param.DeviceIds
        };

        return await FetchPagingDataAsync<Component>(criteria);
    }
}
