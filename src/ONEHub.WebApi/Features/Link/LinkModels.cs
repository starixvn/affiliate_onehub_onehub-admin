using System.ComponentModel.DataAnnotations;

namespace ONEHub.WebApi.Features.Link;

public record GetLinkManagementRequest(
    string? Search,
    string? StatusIds,
    string? CountryCodes,
    string? ChannelIds,
    DateTime? StartDate,
    DateTime? EndDate,
    int PageIndex,
    int PageSize,
    bool IsExportExcel = false);

public record UpdateLinkStatusRequest(
    [Required] int LinkId,
    [Required] int StatusId
);

