using MediatR;
using ONEHub.Domain.Criterias.Common;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.LandingPages.LandingPageService.Queries;

public record GetLandingPageStatusListQuery() : IRequest<IEnumerable<StatusInfo>>;

public class GetLandingPageStatusListQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetLandingPageStatusListQuery, IEnumerable<StatusInfo>>
{
    public async Task<IEnumerable<StatusInfo>> Handle(
        GetLandingPageStatusListQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<StatusInfo>(new SimpleCriteria("Aff_LandingPage_Status_Sel"));
        return results;
    }
}

