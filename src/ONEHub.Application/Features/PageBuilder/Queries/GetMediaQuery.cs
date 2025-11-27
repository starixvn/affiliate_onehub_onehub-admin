using MediatR;
using Microsoft.Extensions.Configuration;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.PageBuilder.Queries;

public class GetMediaQuery : BaseQuery<IEnumerable<MediaItem>>
{
    public int ModuleId { get; set; }
    public string TargetCountryCode { get; set; } = string.Empty;
    public string LanguageCode { get; set; } = string.Empty;
}

public class GetMediaHandler(
    IConfiguration configuration,
    IPageBuilderRepository pageBuilderRepository)
    : IRequestHandler<GetMediaQuery, Result<IEnumerable<MediaItem>>>
{
    public async Task<Result<IEnumerable<MediaItem>>> Handle(GetMediaQuery request, CancellationToken cancellationToken)
    {
        var param = new GetMediaParam
        {
            ModuleId = request.ModuleId,
            TargetCountryCode = request.TargetCountryCode,
            LanguageCode = request.LanguageCode
        };

        var result = await pageBuilderRepository.GetMediaByModuleAsync(param);
        var appSettings = configuration.GetSection("AppSettings");
        var bannerRootUrl = appSettings["BannerRootUrl"] ?? string.Empty;
        if (result.Data != null)
        {
            foreach (var item in result.Data)
            {
                item.FileName = $"{bannerRootUrl}/{item.FileName}";
            }
        }
        return result;
    }
}
