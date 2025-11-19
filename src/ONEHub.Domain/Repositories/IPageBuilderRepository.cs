using ONEHub.Domain.Entities;
using ONEHub.Domain.Params;
using ONEHub.Domain.Results;

namespace ONEHub.Domain.Repositories;

public interface IPageBuilderRepository
{
    public Task<Result<PageBuilder>> GetLandingPageDetailAsync(int pageId);

    public Task<Result<IEnumerable<MediaSourceInfo>>> GetMediaSourceAsync(MediaSourceParam param);

    public Task<Result> CreateLandingPageAsync(CreateLandingPageParam param);

    public Task<Result> UpdateLandingPageAsync(UpdateLandingPageParam param);
}
