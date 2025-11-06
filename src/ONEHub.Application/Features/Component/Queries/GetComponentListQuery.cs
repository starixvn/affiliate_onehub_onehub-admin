using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Component.Queries;

public class GetComponentListQuery : PagingQuery<ComponentResponse>
{
    public string? Search { get; set; } = string.Empty;

    public string? CategoryIds { get; set; } = string.Empty;

    public string? StatusIds { get; set; } = string.Empty;

    public string? DeviceIds { get; set; } = string.Empty;

    public bool IsExportExcel { get; set; }
}

public record ComponentResponse(
    int ComponentId,
    string ComponentCode,
    string ComponentName,
    int ComponentTypeId,
    string CreatedBy,
    string CreatedDate,
    string LastModifiedBy,
    string LastModifiedDate,
    int StatusId,
    string Status,
    string? Device,
    int? DeviceId,
    int RowIdx);

public class GetComponentListHandler(IComponentRepository componentRepository)
    : IRequestHandler<GetComponentListQuery, Result<PagingData<ComponentResponse>>>
{
    public async Task<Result<PagingData<ComponentResponse>>> Handle(GetComponentListQuery request, CancellationToken cancellationToken)
    {
        var param = new ComponentListParam
        {
            Search = request.Search,
            CategoryIds = request.CategoryIds,
            StatusIds = request.StatusIds,
            DeviceIds = request.DeviceIds,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize,
            IsExportExcel = request.IsExportExcel
        };

        var componentListResult = await componentRepository.GetComponentListAsync(param);

        if (componentListResult.IsFailure)
        {
            return Result<PagingData<ComponentResponse>>.Failure(componentListResult.Error);
        }

        if (componentListResult.Data is null)
        {
            return Result<PagingData<ComponentResponse>>.Failure(Error.NoData);
        }

        var result = new PagingData<ComponentResponse>
        {
            Items = componentListResult.Data.Items.Select(component => new ComponentResponse(
                component.ComponentId,
                component.ComponentCode,
                component.ComponentName,
                component.ComponentTypeId,
                component.CreatedBy,
                component.CreatedDate.ToString("MM/dd/yyyy"),
                component.LastModifiedBy,
                component.LastModifiedDate.ToString("MM/dd/yyyy"),
                component.StatusId,
                component.Status,
                component.Device,
                component.DeviceId,
                component.RowIdx
            )).ToList(),
            TotalItem = componentListResult.Data.TotalItem,
            PageIndex = request.PageIndex,
            PageSize = request.PageSize
        };

        return Result<PagingData<ComponentResponse>>.Success(result);
    }
}
