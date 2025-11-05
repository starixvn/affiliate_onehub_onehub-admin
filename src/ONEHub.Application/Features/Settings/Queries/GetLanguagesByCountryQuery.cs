using MediatR;
using ONEHub.Application.Features.Campaign.Queries;
using ONEHub.Domain.Criterias.Components;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Settings.Queries;

public record GetLanguagesByCountryQuery(string CountryCode) : IRequest<Result<IEnumerable<TargetCountry>>>;

public class GetLanguagesByCountryQueryHandler(ISettingsRepository settingsRepository)
    : IRequestHandler<GetLanguagesByCountryQuery, Result<IEnumerable<TargetCountry>>>
{
    public async Task<Result<IEnumerable<TargetCountry>>> Handle(
        GetLanguagesByCountryQuery request,
        CancellationToken cancellationToken)
    {
        var languageListResult = await settingsRepository.GetLanguagesByCountryAsync(request.CountryCode);

        if (languageListResult.IsFailure)
        {
            return Result<IEnumerable<TargetCountry>>.Failure(languageListResult.Error);
        }

        if (languageListResult.Data is null)
        {
            return Result<IEnumerable<TargetCountry>>.Failure(Error.NoData);
        }

        return Result<IEnumerable<TargetCountry>>.Success(languageListResult.Data);
    }
}

