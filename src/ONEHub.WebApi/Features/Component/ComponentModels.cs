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
    [Required][Range(1, int.MaxValue)] int CategoryId,
    [Required][MaxLength(200)] string ComponentName,
    [Required][MaxLength(200)] string ComponentCode,
    [Required][Range(1, int.MaxValue)] int StatusId,
    int? DeviceId
);

public record UpdateComponentRequest(
    [Required][Range(1, int.MaxValue)] int ComponentId,
    [Required][Range(1, int.MaxValue)] int CategoryId,
    [Required][MaxLength(200)] string ComponentName,
    [Required][MaxLength(200)] string ComponentCode,
    [Required] int StatusId,
    int? DeviceId
);

public record UpdateBatchComponentStatusRequest(
    [Required] string ComponentIds,
    [Required][Range(1, int.MaxValue)] int StatusId
);

public record DeleteBatchComponentRequest(
    [Required] string ComponentIds
);

public record GetComponentsByCategoryRequest(
    int CategoryId,
    int? ComponentId
);
