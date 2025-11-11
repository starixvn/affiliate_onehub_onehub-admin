namespace ONEHub.Domain.Params;

public class CampaignListParam : PagingParam
{
    public string? Search { get; set; }

    public string? StatusIds { get; set; }

    public bool IsExportExcel { get; set; }
}

public class CreateCampaignParam : BaseParam
{
    public string CampaignName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int StatusId { get; set; }
}

public class UpdateCampaignParam : BaseParam
{
    public int CampaignId { get; set; }

    public string CampaignName { get; set; } = string.Empty;

    public string? Description { get; set; }

    public int StatusId { get; set; }
}

public class UpdateBatchCampaignStatusParam : BaseParam
{
    public string CampaignIds { get; set; } = string.Empty;

    public int StatusId { get; set; }
}

public class DeleteBatchCampaignParam : BaseParam
{
    public string CampaignIds { get; set; } = string.Empty;
}
