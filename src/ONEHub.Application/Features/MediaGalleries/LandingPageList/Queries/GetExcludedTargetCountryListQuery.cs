using MediatR;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.MediaGalleries.LandingPageList.Queries;

public record GetExcludedTargetCountryListQuery(int PageId) : IRequest<IEnumerable<TargetCountryDto>>;

public class GetExcludedTargetCountryListQueryHandler(
    IDynamicRepository repository,
    ILogger<GetExcludedTargetCountryListQueryHandler> logger)
    : IRequestHandler<GetExcludedTargetCountryListQuery, IEnumerable<TargetCountryDto>>
{
    public async Task<IEnumerable<TargetCountryDto>> Handle(
        GetExcludedTargetCountryListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<TargetCountryDto>(new { request.PageId });
        return results.ToList();
    }
}

