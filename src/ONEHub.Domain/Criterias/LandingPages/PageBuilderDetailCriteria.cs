using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.LandingPages;

public class PageBuilderDetailCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_LandingPage_Builder_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public int PageId { get; set; }
    public string PageCode { get; set; } = string.Empty;
    public bool IsPreview { get; set; }
}

