using Fanex.Data.Repository;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Infrastructure.Repositories.Commands.LandingPages;
using ONEHub.Infrastructure.Repositories.Criterias.LandingPages;

namespace ONEHub.Infrastructure.Repositories;

public class PageBuilderRepository(IDynamicRepository dynamicRepository)
    : BaseRepository(dynamicRepository), IPageBuilderRepository
{
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
