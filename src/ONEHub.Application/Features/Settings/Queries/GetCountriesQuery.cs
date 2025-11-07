using MediatR;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Settings.Queries;

public record GetCountriesQuery : IRequest<Result<IEnumerable<TargetCountry>>>;

public class GetCountriesQueryHandler(ISettingsRepository settingsRepository)
    : IRequestHandler<GetCountriesQuery, Result<IEnumerable<TargetCountry>>>
{
    public async Task<Result<IEnumerable<TargetCountry>>> Handle(
        GetCountriesQuery request,
        CancellationToken cancellationToken)
    {
        var countriesListResult = await settingsRepository.GetTargetCountryListAsync();

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

