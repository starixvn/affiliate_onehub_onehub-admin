using System.ComponentModel.DataAnnotations;

namespace ONEHub.WebApi.Features.Component;

public record GetComponentListRequest(
    string? Search,
    string? Category,
    string? Status,
    string? DeviceIds,
    int PageIndex,
    int PageSize,
    bool IsExportExcel = false);


public record CreateComponentRequest(
    [Required] int CategoryId,
    [Required] string ComponentName,
    [Required] string ComponentCode,
    [Required] int StatusId,
    int? DeviceId
);

public record UpdateComponentRequest(
    [Required] int ComponentId,
    [Required] int CategoryId,
    [Required] string ComponentName,
    [Required] string ComponentCode,
    [Required] int StatusId,
    int? DeviceId
);

public record UpdateBatchComponentStatusRequest(
    [Required] string ComponentIds,
    [Required] int StatusId
);

public record DeleteBatchComponentRequest(
    [Required] string ComponentIds
);
