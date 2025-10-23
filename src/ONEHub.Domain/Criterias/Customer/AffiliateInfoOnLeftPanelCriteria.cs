using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.Customer;

public class AffiliateInfoOnLeftPanelCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_Admin_AffiliateInfo_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => !string.IsNullOrWhiteSpace(Username);

    public string Username { get; set; } = string.Empty;
}

