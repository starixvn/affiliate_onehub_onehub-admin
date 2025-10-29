using System.Net;
using ONEHub.Domain.Common;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Criterias.Common;
using ONEHub.Domain.Criterias.LandingPages;
using ONEHub.Domain.Entities.Common;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Infrastructure.Services;

public class LandingPageService : ILandingPageService
{
    private readonly IDynamicRepository _dynamicRepository;

    public LandingPageService(IDynamicRepository dynamicRepository)
    {
        _dynamicRepository = dynamicRepository;
    }

    public ResultInfo ValidateLanguageByTargetCountry(string languageCode, string targetCountryCode)
    {
        const string InvalidLanguageForTargetCountryMessage = "The selected language is not valid for the chosen country. Please select a supported language.";

        if (string.IsNullOrEmpty(languageCode) || string.IsNullOrEmpty(targetCountryCode))
        {
            return ResultInfo.GenerateError(InvalidLanguageForTargetCountryMessage);
        }

        var languages = _dynamicRepository.FetchAsync<Language>(new TargetCountryCriteria(false)).Result;
        var isValidLanguage = languages.Any(l =>
            string.Equals(l.LanguageCode, languageCode, StringComparison.OrdinalIgnoreCase) &&
            string.Equals(l.TargetCountryCode, targetCountryCode, StringComparison.OrdinalIgnoreCase));

        if (!isValidLanguage)
        {
            return new ResultInfo
            {
                Code = ErrorCodes.GeneralErrorCode,
                Message = InvalidLanguageForTargetCountryMessage
            };
        }

        return ResultInfo.Success;
    }

    public string GetAssetFolder(int moduleId, string targetCountryCode, string languageCode)
    {
        var targetCountryName = GetTargetCountryName(targetCountryCode);
        var languageName = GetLanguageName(languageCode);
        var moduleName = GetModuleName(moduleId);

        return WebUtility.HtmlEncode($"Asset/{targetCountryName}/{languageName}/{moduleName}");
    }

    private string GetTargetCountryName(string targetCountryCode)
    {
        var targetCountries = _dynamicRepository.FetchAsync<TargetCountry>(new TargetCountryCriteria()).Result;
        var targetCountry = targetCountries.FirstOrDefault(tc =>
            string.Equals(tc.TargetCountryCode, targetCountryCode, StringComparison.OrdinalIgnoreCase));

        return targetCountry?.TargetCountryName ?? targetCountryCode;
    }

    private string GetLanguageName(string languageCode)
    {
        var allLanguages = _dynamicRepository.FetchAsync<Language>(new TargetCountryCriteria(false)).Result;
        var languages = allLanguages
            .GroupBy(l => l.LanguageCode)
            .Select(g => g.First())
            .ToList();

        var language = languages.FirstOrDefault(l =>
            string.Equals(l.LanguageCode, languageCode, StringComparison.OrdinalIgnoreCase) ||
            string.Equals(l.ShortedLanguageCode, languageCode, StringComparison.OrdinalIgnoreCase));

        return language?.LanguageName ?? languageCode;
    }

    private string GetModuleName(int moduleId)
    {
        var modules = _dynamicRepository.FetchAsync<ModuleInfo>(new GetModuleCriteria()).Result;
        var module = modules.FirstOrDefault(m => m.ModuleId == moduleId);
        var moduleName = module?.ModuleName ?? moduleId.ToString();

        if (!string.IsNullOrEmpty(moduleName))
        {
            moduleName = moduleName.Replace(" ", string.Empty).Replace("&", "_");
        }

        return moduleName;
    }
}

