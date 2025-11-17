using System.ComponentModel.DataAnnotations;

namespace ONEHub.WebApi.Features.Link;

public record GetLinkListRequest(
    string? Search,
    string? Status,
    string? CountryCodes,
    string? ChannelIds,
    DateTime? StartDate,
    DateTime? EndDate,
    int PageIndex,
    int PageSize,
    bool IsExportExcel = false);

public record GetLinkDashboardRequest(
    string? Search,
    string? CountryCodes,
    string? ChannelIds,
    DateTime? StartDate,
    DateTime? EndDate);

public record UpdateLinkStatusRequest(
    [Required] int LinkId,
    [Required] int StatusId
);

