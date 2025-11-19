using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetCampaignInfoCriteria : CriteriaBase
{
    private const string SP_NAME = "OH_Campaign_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public int? CampaignId { get; set; }

    public string StatusIds { get; set; } = string.Empty;
}
