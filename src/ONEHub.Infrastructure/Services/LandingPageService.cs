using System.Net;
using ONEHub.Application.Services;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Infrastructure.Services;

public class LandingPageService(ISystemRepository systemRepository, ILandingPageRepository landingPageRepository) : ILandingPageService
{
    public async Task<Result> ValidateLanguageByTargetCountry(string languageCode, string targetCountryCode)
    {
        const string InvalidLanguageForTargetCountryMessage = "The selected language is not valid for the chosen country. Please select a supported language.";

        if (string.IsNullOrEmpty(languageCode) || string.IsNullOrEmpty(targetCountryCode))
        {
            return Result.Failure(Error.SystemError with
            {
                Message = InvalidLanguageForTargetCountryMessage
            });
        }

        var languages = await systemRepository.GetTargetCountryAsync(false);
        var isValidLanguage = languages.Data!.Any(l =>
            string.Equals(l.LanguageCode, languageCode, StringComparison.OrdinalIgnoreCase) &&
            string.Equals(l.TargetCountryCode, targetCountryCode, StringComparison.OrdinalIgnoreCase));

        if (!isValidLanguage)
        {
            return Result.Failure(Error.SystemError with
            {
                Message = InvalidLanguageForTargetCountryMessage
            });
        }

        return Result.Success();
    }

    public async Task<string> GetAssetFolder(int moduleId, string targetCountryCode, string languageCode)
    {
        var targetCountryName = await GetTargetCountryName(targetCountryCode);
        var languageName = await GetLanguageName(languageCode);
        var moduleName = await GetModuleName(moduleId);

        return WebUtility.HtmlEncode($"Asset/{targetCountryName}/{languageName}/{moduleName}");
    }

    private async Task<string> GetTargetCountryName(string targetCountryCode)
    {
        var targetCountries = await systemRepository.GetTargetCountryAsync();
        var targetCountry = targetCountries.Data!.FirstOrDefault(tc =>
            string.Equals(tc.TargetCountryCode, targetCountryCode, StringComparison.OrdinalIgnoreCase));

        return targetCountry?.TargetCountryName ?? targetCountryCode;
    }

    private async Task<string> GetLanguageName(string languageCode)
    {
        var allLanguages = await systemRepository.GetTargetCountryAsync(false);
        var languages = allLanguages.Data!
            .GroupBy(l => l.LanguageCode)
            .Select(g => g.First())
            .ToList();

        var language = languages.Find(l =>
            string.Equals(l.LanguageCode, languageCode, StringComparison.OrdinalIgnoreCase) ||
            string.Equals(l.ShortedLanguageCode, languageCode, StringComparison.OrdinalIgnoreCase));

        return language?.LanguageName ?? languageCode;
    }

    private async Task<string> GetModuleName(int moduleId)
    {
        var modules = await landingPageRepository.GetModuleAsync();
        var module = modules.Data!.FirstOrDefault(m => m.ModuleId == moduleId);
        var moduleName = module?.ModuleName ?? moduleId.ToString();

        if (!string.IsNullOrEmpty(moduleName))
        {
            moduleName = moduleName.Replace(" ", string.Empty).Replace("&", "_");
        }

        return moduleName;
    }
}
