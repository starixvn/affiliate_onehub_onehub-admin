using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.PageBuilder.Queries;

public class GetMediaQuery : BaseQuery<MediaItem>
{
    public int ModuleId { get; set; }
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
}

public class GetMediaHandler(
    IPageBuilderRepository pageBuilderRepository)
    : IRequestHandler<GetMediaQuery, Result<MediaItem>>
{
    public async Task<Result<MediaItem>> Handle(GetMediaQuery request, CancellationToken cancellationToken)
    {
        var param = new GetMediaParam
        {
            ModuleId = request.ModuleId,
            TargetCountryCode = request.TargetCountryCode,
            LanguageCode = request.LanguageCode
        };

        return await pageBuilderRepository.GetMediaByModuleAsync(param);
    }
}
