namespace ONEHub.Domain.Params;

public class ComponentListParam : PagingParam
{
    public string? Search { get; set; } = string.Empty;

    public string? CategoryIds { get; set; } = string.Empty;

    public string? StatusIds { get; set; } = string.Empty;

    public string? DeviceIds { get; set; } = string.Empty;

    public bool IsExportExcel { get; set; }
}

public class CreateComponentParam : BaseParam
{
    public int CategoryId { get; set; }

    public string ComponentName { get; set; } = string.Empty;

    public string ComponentCode { get; set; } = string.Empty;

    public int StatusId { get; set; }

    public int? DeviceId { get; set; }
}

public class UpdateComponentParam : BaseParam
{
    public int CategoryId { get; set; }

    public int ComponentId { get; set; }

    public string ComponentName { get; set; } = string.Empty;

    public int StatusId { get; set; }

    public int? DeviceId { get; set; }
}

public class UpdateBatchComponentStatusParam : BaseParam
{
    public string ComponentIds { get; set; } = string.Empty;

    public int StatusId { get; set; }
}

public class DeleteBatchComponentParam : BaseParam
{
    public string ComponentIds { get; set; } = string.Empty;
}
