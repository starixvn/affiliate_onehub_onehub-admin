using Fanex.Data;

namespace ONEHub.Infrastructure.Repositories.Criterias;

public class GetComponentListCriteria : PagingCriteria
{
    public override string GetSettingKey() => "OH_Component_ManageSel";

    public override bool IsValid() => true;

    [SpParam(SqlParamName = "ComponentName")]
    public string? Search { get; set; }

    [SpParam(SqlParamName = "ComponentTypeId")]
    public string? CategoryIds { get; set; }

    public string? StatusIds { get; set; }

    public string? DeviceIds { get; set; }

    public bool IsExportExcel { get; set; }
}
