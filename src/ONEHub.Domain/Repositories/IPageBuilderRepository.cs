using ONEHub.Domain.Entities;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface IPageBuilderRepository
{
    public Task<Result> CreateLandingPageAsync(PageBuilderParam param);

    public Task<Result> UpdateLandingPageAsync(PageBuilderParam param);

    public Task<Result<IEnumerable<MediaItem>>> GetMediaByModuleAsync(GetMediaParam param);

    public Task<Result<IEnumerable<StatusInfo>>> GetLandingPageStatusAsync();

    public Task<Result<PageBuilderDetail>> GetPageBuilderDetailAsync(GetPageBuilderParam param);
}

