using ONEHub.Domain.Results;

namespace ONEHub.Application.Services;
public interface ILandingPageService
{
    Task<Result> ValidateLanguageByTargetCountry(string languageCode, string targetCountryCode);

    Task<string> GetAssetFolder(int moduleId, string targetCountryCode, string languageCode);
}
