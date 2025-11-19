using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Settings.Queries;

public class GetLanguagesQuery : BaseQuery<IEnumerable<TargetCountry>>
{
    public string CountryCode { get; set; } = string.Empty;
}

public class GetLanguagesByCountryQueryHandler(ISystemRepository settingsRepository)
    : IRequestHandler<GetLanguagesQuery, Result<IEnumerable<TargetCountry>>>
{
    public async Task<Result<IEnumerable<TargetCountry>>> Handle(
        GetLanguagesQuery request,
        CancellationToken cancellationToken)
    {
        var languageListResult = await settingsRepository.GetTargetCountryAsync(false, request.CountryCode);

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

