using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.LandingPages;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.LandingPages.PageBuilder.Queries;

public record GetMediaSourcesQuery(GetMediaSourceCriteria Criteria) : IRequest<IEnumerable<MediaSourceInfoDto>>;

public class GetMediaSourcesQueryHandler(
    IDynamicRepository repository,
    ILogger<GetMediaSourcesQueryHandler> logger)
    : IRequestHandler<GetMediaSourcesQuery, IEnumerable<MediaSourceInfoDto>>
{
    public async Task<IEnumerable<MediaSourceInfoDto>> Handle(
        GetMediaSourcesQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<MediaSourceInfoDto>(request.Criteria);
        return results.ToList();
    }
}

