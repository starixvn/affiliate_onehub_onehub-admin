using ONEHub.Domain.DTOs.Common;

namespace ONEHub.Domain.DTOs.Campaigns;

public class GetCampaignListRequest : PagingRequest
{
    public string? Search { get; set; }

    public string? Status { get; set; }

    public bool IsExportExcel { get; set; }
}

