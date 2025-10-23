using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.MediaGalleries;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.MediaGalleries.Common.Queries;

public record GetCurrencyListQuery : IRequest<IEnumerable<MediaGalleryFilterItemDto>>;

public class GetCurrencyListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetCurrencyListQueryHandler> logger)
    : IRequestHandler<GetCurrencyListQuery, IEnumerable<MediaGalleryFilterItemDto>>
{
    public async Task<IEnumerable<MediaGalleryFilterItemDto>> Handle(
        GetCurrencyListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<MediaGalleryFilterItemDto>(new { });
        return results.ToList();
    }
}

