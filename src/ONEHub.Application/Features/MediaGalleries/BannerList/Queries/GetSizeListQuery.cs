using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.MediaGalleries;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.MediaGalleries.BannerList.Queries;

public record GetSizeListQuery(SizeParamDto Param) : IRequest<IEnumerable<MediaGalleryFilterItemDto>>;

public class GetSizeListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetSizeListQueryHandler> logger)
    : IRequestHandler<GetSizeListQuery, IEnumerable<MediaGalleryFilterItemDto>>
{
    public async Task<IEnumerable<MediaGalleryFilterItemDto>> Handle(
        GetSizeListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<MediaGalleryFilterItemDto>(request.Param);
        return results.ToList();
    }
}

