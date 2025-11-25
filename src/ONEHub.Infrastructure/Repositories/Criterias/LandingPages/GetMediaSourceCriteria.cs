using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias.LandingPages;

public class GetMediaSourceCriteria : CriteriaBase
{
    private const string SP_NAME = "OH_Media_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public int ModuleId { get; set; }
    public string? TargetCountryCode { get; set; }
    public string? LanguageCode { get; set; }
}
