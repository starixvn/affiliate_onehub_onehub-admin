namespace ONEHub.WebApi.Features.Component;

public record GetComponentListRequest(
    string? Search,
    string? Category,
    string? Status,
    string? DeviceIds,
    int PageIndex,
    int PageSize,
    bool IsExportExcel = false);
