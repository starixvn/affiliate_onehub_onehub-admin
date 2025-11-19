using MediatR;
using Microsoft.Extensions.Configuration;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.LandingPages.AssetUploader;

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
        var bannerRootUrl = configuration["AppSettings:BannerRootUrl"] ?? string.Empty;
        var maxFiles = int.Parse(configuration["AppSettings:MaximumFiles"] ?? "50");
        var maxFileSize = int.Parse(configuration["AppSettings:MaxFileSize"] ?? "3");
        var allowedExtensions = configuration["AppSettings:AllowedImageExtensions"]?.Split(',') ?? [".jpg", ".jpeg", ".png", ".gif", ".webp"];

        var targetCountries = await systemRepository.GetTargetCountryAsync();
        var languages = await systemRepository.GetTargetCountryAsync(false);
        var modules = await landingPageRepository.GetModuleAsync();
        var status = await landingPageRepository.GetStatusAsync();

        return Result<FiltersResponse>.Success(
            new FiltersResponse(
                bannerRootUrl,
                maxFiles,
                maxFileSize,
                allowedExtensions,
                targetCountries.Data!,
                languages.Data!,
                modules.Data!,
                status.Data!));
    }
}
