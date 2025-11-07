using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPage.Queries;

public class GetLandingPageOptionsQuery : BaseQuery<IEnumerable<LandingPageOption>>;

public class GetLandingPageOptionsQueryHandler(ILandingPageRepository repository)
    : IRequestHandler<GetLandingPageOptionsQuery, Result<IEnumerable<LandingPageOption>>>
{
    public async Task<Result<IEnumerable<LandingPageOption>>> Handle(
        GetLandingPageOptionsQuery request,
        CancellationToken cancellationToken)
    {
        var landingPages = await repository.GetLandingPageOptionsAsync();

        if (landingPages.IsFailure)
        {
            return Result<IEnumerable<LandingPageOption>>.Failure(landingPages.Error);
        }

        if (landingPages.Data is null)
        {
            return Result<IEnumerable<LandingPageOption>>.Failure(Error.NoData);
        }

        return Result<IEnumerable<LandingPageOption>>.Success(landingPages.Data);
    }
}

