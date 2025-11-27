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
    public async Task<Result<LinkManagement>> GetLinkManagementDataAsync(LinkManagementParam param)
    {
        var criteria = new GetLinkManagementCriteria
        {
            Search = param.Search,
            StatusIds = param.StatusIds,
            CountryCodes = param.CountryCodes,
            ChannelIds = param.ChannelIds,
            StartDate = param.StartDate,
            EndDate = param.EndDate,
            PageSize = param.PageSize,
            PageIndex = param.PageIndex,
            IsExportExcel = param.IsExportExcel
        };

        var (linkResult, dashboard) = await FetchMultipleDataAsync<LinkInfo, LinkDashboard>(criteria);

        var pagingData = new PagingData<LinkInfo>
        {
            Items = [.. linkResult],
            TotalItem = criteria.TotalItem,
            PageSize = criteria.PageSize,
            PageIndex = criteria.PageIndex
        };

        return Result<LinkManagement>.Success(new LinkManagement
        {
            Links = pagingData,
            Dashboard = dashboard.FirstOrDefault() ?? new LinkDashboard()
        });
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

        return await ExecuteCommandAsync(command);
    }
}

