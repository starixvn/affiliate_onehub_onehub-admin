using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Commands;
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

    public async Task<Result> CreateComponentAsync(CreateComponentParam param)
    {
        var command = new CreateComponentCommand
        {
            CategoryId = param.CategoryId,
            ComponentCode = param.ComponentCode,
            ComponentName = param.ComponentName,
            StatusId = param.StatusId,
            DeviceId = param.DeviceId,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };

        var result = await ExecuteCommandAsync(command);

        return result;
    }

    public async Task<Result> UpdateComponentAsync(UpdateComponentParam param)
    {
        var command = new UpdateComponentCommand
        {
            ComponentId = param.ComponentId,
            ComponentName = param.ComponentName,
            CategoryId = param.CategoryId,
            DeviceId = param.DeviceId,
            StatusId = param.StatusId,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };
        var result = await ExecuteCommandAsync(command);

        return result;
    }

    public async Task<Result> UpdateBatchComponentStatusAsync(UpdateBatchComponentStatusParam param)
    {
        var command = new UpdateBatchComponentStatusCommand
        {
            ComponentIds = param.ComponentIds,
            StatusId = param.StatusId,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };
        var result = await ExecuteCommandAsync(command);

        return result;
    }

    public async Task<Result> DeleteBatchComponentAsync(DeleteBatchComponentParam param)
    {
        var command = new DeleteBatchComponentCommand
        {
            ComponentIds = param.ComponentIds,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };
        var result = await ExecuteCommandAsync(command);

        return result;
    }

    public async Task<Result<IEnumerable<Component>>> GetComponentByCategoryAsync(GetComponentByCategoryParam param)
    {
        var criteria = new GetComponentByCategoryCriteria
        {
            CategoryId = param.CategoryId,
            ComponentId = param.ComponentId
        };

        return await FetchDataAsync<Component>(criteria);
    }
}
