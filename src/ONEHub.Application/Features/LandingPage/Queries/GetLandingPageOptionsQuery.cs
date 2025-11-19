using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPage.Queries;

public class GetLandingPageOptionsQuery : BaseQuery<Dictionary<string, List<LandingPageOption>>>;

public class GetLandingPageOptionsQueryHandler(ILandingPageRepository repository)
    : IRequestHandler<GetLandingPageOptionsQuery, Result<Dictionary<string, List<LandingPageOption>>>>
{
    public async Task<Result<Dictionary<string, List<LandingPageOption>>>> Handle(
        GetLandingPageOptionsQuery request,
        CancellationToken cancellationToken)
    {
        var landingPages = await repository.GetLandingPageOptionsAsync();

        if (landingPages.IsFailure)
        {
            return Result<Dictionary<string, List<LandingPageOption>>>.Failure(landingPages.Error);
        }

        if (landingPages.Data is null)
        {
            return Result<Dictionary<string, List<LandingPageOption>>>.Failure(Error.NoData);
        }

        var grouped = landingPages.Data
            .GroupBy(lp => lp.Category ?? "Others")
            .OrderBy(g => g.Key)
            .ToDictionary(
                g => g.Key,
                g => g.OrderBy(lp => lp.PageName).ToList()
            );

        return Result<Dictionary<string, List<LandingPageOption>>>.Success(grouped);
    }
}

