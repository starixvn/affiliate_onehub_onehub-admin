using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias.LandingPages;

public class GetLandingPageDetailCriteria : CriteriaBase
{
    private const string SP_NAME = "OH_PageBuilder_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public int PageId { get; set; }
    public string? PageCode { get; set; }
    public bool IsPreview { get; set; }
}
