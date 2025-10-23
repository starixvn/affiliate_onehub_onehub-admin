using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.Customer;

public class TransferLimitDetailCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_Admin_TransferLimit_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => AffId > 0;

    public int AffId { get; set; }
}

