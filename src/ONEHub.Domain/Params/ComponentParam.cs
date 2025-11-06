namespace ONEHub.Domain.Params;

public class ComponentListParam : PagingParam
{
    public string? Search { get; set; } = string.Empty;

    public string? CategoryIds { get; set; } = string.Empty;

    public string? StatusIds { get; set; } = string.Empty;

    public string? DeviceIds { get; set; } = string.Empty;

    public bool IsExportExcel { get; set; }
}
