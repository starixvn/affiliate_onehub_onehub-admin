using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetPageBuilderDetailCriteria : CriteriaBase
{
    private const string SP_NAME = "OH_PageBuilder_Sel";
    public int PageId { get; set; }
    public string PageCode { get; set; } = string.Empty;
    public bool IsPreview { get; set; }

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;
}

