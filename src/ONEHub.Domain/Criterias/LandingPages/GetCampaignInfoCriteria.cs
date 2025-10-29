using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.LandingPages;

public class GetCampaignInfoCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_LandingPage_Campaign_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public string StatusIds { get; set; } = "1";
}

