namespace ONEHub.Domain.Params;

public class LinkManagementParam : PagingParam
{
    public string? Search { get; set; } = string.Empty;

    public string? StatusIds { get; set; } = string.Empty;

    public string? CountryCodes { get; set; } = string.Empty;

    public string? ChannelIds { get; set; } = string.Empty;

    public DateTime? StartDate { get; set; }

    public DateTime? EndDate { get; set; }

    public bool IsExportExcel { get; set; }
}

public class UpdateLinkParam : BaseParam
{
    public int LinkId { get; set; }

    public int StatusId { get; set; }
}

