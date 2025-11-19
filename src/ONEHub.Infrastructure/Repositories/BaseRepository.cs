using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Commands;
using ONEHub.Infrastructure.Repositories.Criterias;

namespace ONEHub.Infrastructure.Repositories;

public abstract class BaseRepository(IDynamicRepository dynamicRepository)
{
    public virtual async Task<Result<PagingData<T>>> FetchPagingDataAsync<T>(PagingCriteria criteria) where T : class
    {
        var data = await dynamicRepository.FetchAsync<T>(criteria);
        var pagingData = new PagingData<T>
        {
            Items = [.. data],
            TotalItem = criteria.TotalItem,
            PageSize = criteria.PageSize,
            PageIndex = criteria.PageIndex
        };

        return Result<PagingData<T>>.Success(pagingData);
    }

    public virtual async Task<Result<IEnumerable<T>>> FetchDataAsync<T>(CriteriaBase criteria) where T : class
    {
        var data = await dynamicRepository.FetchAsync<T>(criteria);
        return Result<IEnumerable<T>>.Success(data);
    }

    public virtual async Task<Result<T>> GetDataAsync<T>(CriteriaBase criteria) where T : class
    {
        var data = await dynamicRepository.GetAsync<T>(criteria);
        return Result<T>.Success(data);
    }

    public virtual async Task<Result> ExecuteCommandAsync(BaseCommand command)
    {
        await dynamicRepository.ExecuteAsync(command);
        if (command.ErrCode != 0 || !string.IsNullOrWhiteSpace(command.ErrMsg))
        {
            return Result.Failure(new Error(command.ErrCode, command.ErrMsg));
        }

        return Result.Success();
    }
}
