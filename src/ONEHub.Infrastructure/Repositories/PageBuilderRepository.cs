using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Commands;
using ONEHub.Infrastructure.Repositories.Criterias;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Commands.LandingPages;
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

    public async Task<Result<MediaItem>> GetMediaByModuleAsync(GetMediaParam param)
    {
        var criteria = new GetMediaCriteria
        {
            ModuleId = param.ModuleId,
            TargetCountryCode = param.TargetCountryCode,
            MarketId = param.LanguageCode
        };

        return await GetDataAsync<MediaItem>(criteria);
    }

    public async Task<Result<IEnumerable<StatusInfo>>> GetLandingPageStatusAsync()
    {
        var criteria = new GetLandingPageStatusCriteria();
        var result = await FetchDataAsync<StatusInfo>(criteria);

        return result;
    }

    public async Task<Result<PageBuilderDetail>> GetPageBuilderDetailAsync(int pageId)
    {
        var criteria = new GetPageBuilderDetailCriteria
        {
            PageId = pageId
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

    public async Task<Result<PageBuilder>> GetLandingPageDetailAsync(int pageId)
    {
        var criteria = new GetLandingPageDetailCriteria
        {
            PageId = pageId
        };
        return await GetDataAsync<PageBuilder>(criteria);
    }

    public async Task<Result<IEnumerable<MediaSourceInfo>>> GetMediaSourceAsync(MediaSourceParam param)
    {
        var criteria = new GetMediaSourceCriteria
        {
            ModuleId = param.ModuleId,
            TargetCountryCode = param.TargetCountryCode,
            LanguageCode = param.LanguageCode
        };
        return await FetchDataAsync<MediaSourceInfo>(criteria);
    }

    public async Task<Result> CreateLandingPageAsync(CreateLandingPageParam param)
    {
        var command = new CreateLandingPageCommand
        {
            CampaignId = param.CampaignId,
            PageName = param.PageName,
            PageCode = param.PageCode,
            ComponentStructure = param.ModuleComponentsSetting,
            TargetCountryCode = param.TargetCountryCode,
            LanguageCode = param.LanguageCode,
            StatusId = param.StatusId,
            IsPreview = param.IsPreview,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };
        var result = await ExecuteCommandAsync(command);

        return result;
    }

    public async Task<Result> UpdateLandingPageAsync(UpdateLandingPageParam param)
    {
        var command = new UpdateLandingPageCommand
        {
            CampaignId = param.CampaignId,
            PageName = param.PageName,
            ComponentStructure = param.ModuleComponentsSetting,
            TargetCountryCode = param.TargetCountryCode,
            LanguageCode = param.LanguageCode,
            StatusId = param.StatusId,
            PageId = param.PageId,
            UserId = param.UserId,
            Ip = param.Ip,
            Host = param.Host
        };
        var result = await ExecuteCommandAsync(command);

        return result;
    }
}
