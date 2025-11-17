using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Commands;
using ONEHub.Infrastructure.Repositories.Criterias;

namespace ONEHub.Infrastructure.Repositories;

public class LinkRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), ILinkRepository
{
    public async Task<Result<LinkDashboard>> GetLinkDashboardAsync(LinkDashboardParam param)
    {
        var criteria = new GetLinkDashboardCriteria
        {
            Search = param.Search,
            CountryCodes = param.CountryCodes,
            ChannelIds = param.ChannelIds,
            StartDate = param.StartDate,
            EndDate = param.EndDate
        };
        return await GetDataAsync<LinkDashboard>(criteria);
    }

    public async Task<Result<PagingData<LinkInfo>>> GetLinkListAsync(LinkListParam param)
    {
        var criteria = new GetLinkListCriteria
        {
            IsExportExcel = param.IsExportExcel,
            PageSize = param.PageSize,
            PageIndex = param.PageIndex,
            Search = param.Search,
            StatusIds = param.StatusIds,
            CountryCodes = param.CountryCodes,
            ChannelIds = param.ChannelIds,
            StartDate = param.StartDate,
            EndDate = param.EndDate
        };

        return await FetchPagingDataAsync<LinkInfo>(criteria);
    }

    public async Task<Result> UpdateLinkStatusAsync(UpdateLinkParam param)
    {
        var command = new UpdateLinkStatusCommand
        {
            LinkId = param.LinkId,
            StatusId = param.StatusId,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };
        var result = await ExecuteCommandAsync(command);

        return result;
    }
}

