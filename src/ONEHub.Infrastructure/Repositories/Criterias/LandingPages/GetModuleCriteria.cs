using Fanex.Data.Repository;

namespace ONEHub.Infrastructure.Repositories.Criterias.LandingPages;

public class GetModuleCriteria(string? moduleTypes) : CriteriaBase
{
    private const string SP_NAME = "OH_Module_Sel";

    public override string GetSettingKey() => SP_NAME;

    public override bool IsValid() => true;

    public string? ModuleTypes { get; set; } = moduleTypes;
}
