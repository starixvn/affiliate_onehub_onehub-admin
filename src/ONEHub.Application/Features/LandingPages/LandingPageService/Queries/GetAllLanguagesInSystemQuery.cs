using MediatR;
using ONEHub.Domain.Criterias.Common;
using ONEHub.Domain.Entities.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.LandingPages.LandingPageService.Queries;

public record GetAllLanguagesInSystemQuery : IRequest<IEnumerable<Language>>;

public class GetAllLanguagesInSystemQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetAllLanguagesInSystemQuery, IEnumerable<Language>>
{
    public async Task<IEnumerable<Language>> Handle(
        GetAllLanguagesInSystemQuery request,
        CancellationToken cancellationToken)
    {
        var results = await repository.FetchAsync<Language>(new TargetCountryCriteria(false));
        return results;
    }
}

