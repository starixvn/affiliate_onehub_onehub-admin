using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.MediaGalleries;

public class LandingPageDetailCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_Admin_LandingPage_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public int? PageId { get; set; }
}

