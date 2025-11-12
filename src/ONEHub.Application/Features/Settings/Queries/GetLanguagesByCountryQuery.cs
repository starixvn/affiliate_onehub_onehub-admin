using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Settings.Queries;

public class GetLanguagesQuery : BaseQuery<IEnumerable<Market>>;

public class GetLanguagesByCountryQueryHandler(ISettingsRepository settingsRepository)
    : IRequestHandler<GetLanguagesQuery, Result<IEnumerable<Market>>>
{
    public async Task<Result<IEnumerable<Market>>> Handle(
        GetLanguagesQuery request,
        CancellationToken cancellationToken)
    {
        var languageListResult = await settingsRepository.GetLanguagesAsync();

        if (languageListResult.IsFailure)
        {
            return Result<IEnumerable<Market>>.Failure(languageListResult.Error);
        }

        if (languageListResult.Data is null)
        {
            return Result<IEnumerable<Market>>.Failure(Error.NoData);
        }

        return Result<IEnumerable<Market>>.Success(languageListResult.Data);
    }
}

