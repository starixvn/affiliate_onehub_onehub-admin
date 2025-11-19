using MediatR;
using Microsoft.Extensions.Configuration;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.PageManagement.Queries;

public class GetPageManagementFiltersQuery : BaseQuery<PageManagementFiltersResponse>;

public record PageManagementFiltersResponse(
    string LandingPageUrl,
    DateTime Today,
    DateTime DefaultFromDate,
    DateTime DefaultToDate,
    IEnumerable<TargetCountry> TargetCountries,
    IEnumerable<TargetCountry> Languages,
    IEnumerable<StatusInfo> StatusInfos);

public class GetPageManagementFiltersHandler(
    IConfiguration configuration,
    ISystemRepository systemRepository,
    ILandingPageRepository landingPageRepository)
    : IRequestHandler<GetPageManagementFiltersQuery, Result<PageManagementFiltersResponse>>
{
    public async Task<Result<PageManagementFiltersResponse>> Handle(GetPageManagementFiltersQuery request, CancellationToken cancellationToken)
    {
        var landingPageUrl = configuration["AppSettings:LandingPageUrl"] ?? string.Empty;
        var today = DateTimeOffset.Now.Date;
        var firstDayOfMonth = new DateTimeOffset(today.Year, today.Month, 1, 0, 0, 0, TimeSpan.Zero);

        var targetCountries = await systemRepository.GetTargetCountryAsync();
        var languages = await systemRepository.GetTargetCountryAsync(false);
        var status = await landingPageRepository.GetStatusAsync();

        return Result<PageManagementFiltersResponse>.Success(
            new PageManagementFiltersResponse(
                landingPageUrl,
                today,
                firstDayOfMonth.DateTime,
                today,
                targetCountries.Data!,
                languages.Data!,
                status.Data!));
    }
}
