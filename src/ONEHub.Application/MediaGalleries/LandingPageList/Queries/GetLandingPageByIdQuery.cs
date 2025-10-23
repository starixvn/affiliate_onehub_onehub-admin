using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.MediaGalleries;
using ONEHub.Domain.Criterias.MediaGalleries;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.MediaGalleries.LandingPageList.Queries;

public record GetLandingPageByIdQuery(int PageId) : IRequest<LandingPageDto?>;

public class GetLandingPageByIdQueryHandler(
    IDynamicRepository repository,
    ILogger<GetLandingPageByIdQueryHandler> logger)
    : IRequestHandler<GetLandingPageByIdQuery, LandingPageDto?>
{
    public async Task<LandingPageDto?> Handle(
        GetLandingPageByIdQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new LandingPageDetailCriteria { PageId = request.PageId };
        return await repository.GetAsync<LandingPageDto>(criteria);
    }
}

