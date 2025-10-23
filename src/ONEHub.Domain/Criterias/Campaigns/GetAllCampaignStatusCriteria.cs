using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.Campaigns;

public class GetAllCampaignStatusCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_LandingPage_Campaign_Status_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;
}

