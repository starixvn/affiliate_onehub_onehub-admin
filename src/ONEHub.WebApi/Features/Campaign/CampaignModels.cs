using System.ComponentModel.DataAnnotations;

namespace ONEHub.WebApi.Features.Campaign;

public record GetCampaignListRequest(
    string? Search,
    string? Status,
    int PageIndex,
    int PageSize,
    bool IsExportExcel = false);

public record CreateCampaignRequest(
    [Required] string CampaignName,
    string? Description,
    [Required] int Status
);

public record UpdateCampaignRequest(
    [Required] int CampaignId,
    [Required] string CampaignName,
    string? Description,
    [Required] int StatusId
);

public record UpdateBatchCampaignStatusRequest(
    [Required] string CampaignIds,
    [Required] int StatusId
);

public record DeleteBatchCampaignRequest(
    [Required] string CampaignIds
);
