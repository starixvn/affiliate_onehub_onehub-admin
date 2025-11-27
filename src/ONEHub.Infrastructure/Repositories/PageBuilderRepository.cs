using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Commands;
using ONEHub.Infrastructure.Repositories.Criterias;
using ONEHub.Infrastructure.Repositories.Criterias.LandingPages;

namespace ONEHub.Infrastructure.Repositories;

public class PageBuilderRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), IPageBuilderRepository
{
    public async Task<Result> CreateLandingPageAsync(PageBuilderParam param)
    {
        var command = new InsertLandingPageCommand
        {
            PageCode = param.PageCode,
            PageName = param.PageName,
            CampaignId = param.CampaignId,
            TargetCountryCode = param.TargetCountryCode,
            MarketId = param.MarketId,
            ComponentStructure = param.ComponentStructure,
            StatusId = param.StatusId,
            UserId = param.UserId,
            IsPreview = param.IsPreview,
            Ip = param.Ip,
            Host = param.Host
        };

        var result = await ExecuteCommandAsync(command);
        param.PageId = command.PageId;
        return result;
    }

    public async Task<Result> UpdateLandingPageAsync(PageBuilderParam param)
    {
        var command = new UpdateLandingPageCommand
        {
            PageId = param.PageId,
            PageName = param.PageName,
            CampaignId = param.CampaignId,
            TargetCountryCode = param.TargetCountryCode,
            MarketId = param.MarketId,
            ComponentStructure = param.ComponentStructure,
            StatusId = param.StatusId,
            UserId = param.UserId,
            IsUpdStatus = false,
            Ip = param.Ip,
            Host = param.Host
        };

        var result = await ExecuteCommandAsync(command);
        return result;
    }

    public async Task<Result<IEnumerable<MediaItem>>> GetMediaByModuleAsync(GetMediaParam param)
    {
        var criteria = new GetMediaCriteria
        {
            ModuleId = param.ModuleId,
            TargetCountryCode = param.TargetCountryCode,
            MarketId = param.LanguageCode
        };

        return await FetchDataAsync<MediaItem>(criteria);
    }

    public async Task<Result<IEnumerable<StatusInfo>>> GetLandingPageStatusAsync()
    {
        var criteria = new GetLandingPageStatusCriteria();
        var result = await FetchDataAsync<StatusInfo>(criteria);

        return result;
    }

    public async Task<Result<PageBuilderDetail>> GetPageBuilderDetailAsync(GetPageBuilderParam param)
    {
        var criteria = new GetPageBuilderDetailCriteria
        {
            PageId = param.PageId,
            PageCode = param.PageCode,
            IsPreview = param.IsPreview
        };
        var result = await dynamicRepository.FetchMultipleAsync<PageBuilderDetail, ModuleComponentItem>(criteria);
        var pageDetail = result.Item1.FirstOrDefault();
        if (pageDetail != null)
        {
            pageDetail.ModuleComponentSettings = result.Item2;
        }

        return Result<PageBuilderDetail>.Success(pageDetail!);
    }
}
