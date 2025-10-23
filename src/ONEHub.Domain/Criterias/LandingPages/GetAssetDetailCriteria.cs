using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.LandingPages;

public class GetAssetDetailCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_LandingPage_AssetUploader_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => MediaId > 0;

    public int MediaId { get; set; }
    public int UserId { get; set; }
}

