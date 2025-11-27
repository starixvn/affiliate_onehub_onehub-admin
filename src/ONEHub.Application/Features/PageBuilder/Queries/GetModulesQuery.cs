using MediatR;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.PageBuilder.Queries;

public record GetModulesQuery : IRequest<Result<IEnumerable<ModuleInfo>>>;

public class GetModulesHandler(ILandingPageRepository landingPageRepository)
    : IRequestHandler<GetModulesQuery, Result<IEnumerable<ModuleInfo>>>
{
    public async Task<Result<IEnumerable<ModuleInfo>>> Handle(
        GetModulesQuery request,
        CancellationToken cancellationToken)
    {
        var results = await landingPageRepository.GetModuleAsync();
        return results;
    }
}

