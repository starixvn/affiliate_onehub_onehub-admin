using MediatR;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.PageBuilder.Queries;

public record GetLandingPageStatusQuery : IRequest<Result<IEnumerable<StatusInfo>>>;

public class GetLandingPageStatusHandler(IPageBuilderRepository pageBuilderRepository)
    : IRequestHandler<GetLandingPageStatusQuery, Result<IEnumerable<StatusInfo>>>
{
    public async Task<Result<IEnumerable<StatusInfo>>> Handle(
        GetLandingPageStatusQuery request,
        CancellationToken cancellationToken)
    {
        var results = await pageBuilderRepository.GetLandingPageStatusAsync();
        return results;
    }
}

