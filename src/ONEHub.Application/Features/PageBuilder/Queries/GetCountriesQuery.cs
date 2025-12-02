using MediatR;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.PageBuilder.Queries;

public record GetCountriesQuery : IRequest<Result<IEnumerable<TargetCountry>>>;

public class GetCountriesQueryHandler(ISystemRepository settingsRepository)
    : IRequestHandler<GetCountriesQuery, Result<IEnumerable<TargetCountry>>>
{
    public async Task<Result<IEnumerable<TargetCountry>>> Handle(
        GetCountriesQuery request,
        CancellationToken cancellationToken)
    {
        var countriesListResult = await settingsRepository.GetTargetCountryAsync();

        if (countriesListResult.IsFailure)
        {
            return Result<IEnumerable<TargetCountry>>.Failure(countriesListResult.Error);
        }

        if (countriesListResult.Data is null)
        {
            return Result<IEnumerable<TargetCountry>>.Failure(Error.NoData);
        }

        return Result<IEnumerable<TargetCountry>>.Success(countriesListResult.Data);
    }
}

