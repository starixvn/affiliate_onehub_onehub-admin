using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.MediaGalleries;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.MediaGalleries.LandingPageList.Queries;

public record GetLandingPageListQuery : IRequest<IEnumerable<LandingPageDto>>;

public class GetLandingPageListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetLandingPageListQueryHandler> logger)
    : IRequestHandler<GetLandingPageListQuery, IEnumerable<LandingPageDto>>
{
    public async Task<IEnumerable<LandingPageDto>> Handle(
        GetLandingPageListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<LandingPageDto>(new { });
        return results.ToList();
    }
}

