using MediatR;
using Microsoft.Extensions.Configuration;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.BaseMedia.Queries;

public class GetFiltersQuery : BaseQuery<FiltersResponse>;

public record FiltersResponse(
    string BannerRootUrl,
    int MaxFiles,
    int MaxFileSize,
    string[] AllowedExtensions,
    IEnumerable<TargetCountry> TargetCountries,
    IEnumerable<TargetCountry> Languages,
    IEnumerable<ModuleInfo> Modules,
    IEnumerable<StatusInfo> StatusInfos);

public class GetFiltersHandler(
    IConfiguration configuration,
    ISystemRepository systemRepository,
    ILandingPageRepository landingPageRepository)
    : IRequestHandler<GetFiltersQuery, Result<FiltersResponse>>
{
    public async Task<Result<FiltersResponse>> Handle(GetFiltersQuery request, CancellationToken cancellationToken)
    {
        var appSettings = configuration.GetSection("AppSettings");
        var bannerRootUrl = appSettings["BannerRootUrl"] ?? string.Empty;

        const int maxFiles = ONEHub.Domain.Constants.LandingPages.FileUpload.MaximumFiles;
        const int maxFileSize = ONEHub.Domain.Constants.LandingPages.FileUpload.MaxFileSizeMegabytes;
        var allowedExtensions = ONEHub.Domain.Constants.LandingPages.FileExtensions.AllImageExtensions;

        var targetCountriesTask = systemRepository.GetTargetCountryAsync();
        var languagesTask = systemRepository.GetTargetCountryAsync(false);
        var modulesTask = landingPageRepository.GetModuleAsync();

        await Task.WhenAll(targetCountriesTask, languagesTask, modulesTask);

        var targetCountries = targetCountriesTask.Result.Data.OrderBy(x => x.TargetCountryName);
        var languages = languagesTask.Result.Data.OrderBy(x => x.LanguageName);
        var modules = modulesTask.Result.Data.OrderBy(x => x.ModuleName);
        var statuses = ONEHub.Domain.Constants.LandingPages.AssetStatusList;

        var response = new FiltersResponse(
            bannerRootUrl,
            maxFiles,
            maxFileSize,
            allowedExtensions,
            targetCountries,
            languages,
            modules,
            statuses
        );

        return Result<FiltersResponse>.Success(response);
    }
}
