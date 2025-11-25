using System.ComponentModel.DataAnnotations;

namespace ONEHub.WebApi.Features.PageManagement;

public record GetPageManagementDashboardRequest;

public record GetLandingPageListRequest(
    string? Search,
    string? StatusIds,
    string? CountryCodes,
    string? LanguageCodes,
    [Required] DateTime FromDate,
    [Required] DateTime ToDate,
    [Required] int PageIndex,
    [Required] int PageSize
);

public record UpdateBatchLandingPageStatusRequest(
    [Required] string PageIds,
    [Required] int StatusId
);

public record DeleteBatchLandingPageRequest(
    [Required] string PageIds
);
