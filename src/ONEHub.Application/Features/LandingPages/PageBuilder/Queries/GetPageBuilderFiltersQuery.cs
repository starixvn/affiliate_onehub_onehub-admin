using MediatR;
using Microsoft.Extensions.Configuration;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.PageBuilder.Queries;

public class GetPageBuilderFiltersQuery : BaseQuery<PageBuilderFiltersResponse>;

public record PageBuilderFiltersResponse(
    string LandingPageUrl,
    DateTime Today,
    IEnumerable<TargetCountry> TargetCountries,
    IEnumerable<TargetCountry> Languages,
    IEnumerable<StatusInfo> StatusInfos);

public class GetPageBuilderFiltersHandler(
    IConfiguration configuration,
    ISystemRepository systemRepository,
    ILandingPageRepository landingPageRepository)
    : IRequestHandler<GetPageBuilderFiltersQuery, Result<PageBuilderFiltersResponse>>
{
    public async Task<Result<PageBuilderFiltersResponse>> Handle(GetPageBuilderFiltersQuery request, CancellationToken cancellationToken)
    {
        var landingPageUrl = configuration["AppSettings:LandingPageUrl"] ?? string.Empty;

        var targetCountries = await systemRepository.GetTargetCountryAsync();
        var languages = await systemRepository.GetTargetCountryAsync(false);
        var status = await landingPageRepository.GetStatusAsync();

        return Result<PageBuilderFiltersResponse>.Success(
            new PageBuilderFiltersResponse(
                landingPageUrl,
                DateTimeOffset.Now.Date,
                targetCountries.Data!,
                languages.Data!,
                status.Data!));
    }
}
