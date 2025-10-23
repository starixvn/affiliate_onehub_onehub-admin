using ONEHub.Domain.Common;

namespace ONEHub.Domain.Interfaces;

public interface ILandingPageService
{
    ResultInfo ValidateLanguageByTargetCountry(string languageCode, string targetCountryCode);
    string GetAssetFolder(int moduleId, string targetCountryCode, string languageCode);
}

