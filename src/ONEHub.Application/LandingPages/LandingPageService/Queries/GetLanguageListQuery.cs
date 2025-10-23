using MediatR;
using ONEHub.Domain.Criterias.Common;
using ONEHub.Domain.Entities.Common;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.LandingPages.LandingPageService.Queries;

public record GetLanguageListQuery() : IRequest<IEnumerable<Language>>;

public class GetLanguageListQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetLanguageListQuery, IEnumerable<Language>>
{
    public async Task<IEnumerable<Language>> Handle(
        GetLanguageListQuery request,
        CancellationToken cancellationToken)
    {
        var allLanguages = await repository.FetchAsync<Language>(new TargetCountryCriteria(false));
        return allLanguages
            .GroupBy(l => l.LanguageCode)
            .Select(g => g.First())
            .ToList();
    }
}

