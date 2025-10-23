using Fanex.Data.Repository;

namespace ONEHub.Domain.Criterias.LandingPages;

public class GetModuleCriteria : CriteriaBase
{
    private const string SP_NAME = "Aff_LandingPage_Module_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public string? ModuleTypes { get; set; }
}

