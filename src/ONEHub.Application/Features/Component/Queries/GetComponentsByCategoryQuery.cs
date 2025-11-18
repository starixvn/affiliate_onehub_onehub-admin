using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Component.Queries;

public record ComponentByCategoryResponse(
    int ComponentId,
    string ComponentCode,
    string ComponentName,
    int ComponentTypeId,
    int StatusId,
    string Status
);

public class GetComponentsByCategoryQuery : BaseQuery<IEnumerable<ComponentByCategoryResponse>>
{
    public int CategoryId { get; set; }

    public int? ComponentId { get; set; }
}

public class GetComponentsByCategoryQueryHandler(IComponentRepository repository)
    : IRequestHandler<GetComponentsByCategoryQuery, Result<IEnumerable<ComponentByCategoryResponse>>>
{
    public async Task<Result<IEnumerable<ComponentByCategoryResponse>>> Handle(
        GetComponentsByCategoryQuery request,
        CancellationToken cancellationToken)
    {
        var param = new GetComponentByCategoryParam
        {
            CategoryId = request.CategoryId,
            ComponentId = request.ComponentId
        };

        var componentListResult = await repository.GetComponentByCategoryAsync(param);

        if (componentListResult.IsFailure)
        {
            return Result<IEnumerable<ComponentByCategoryResponse>>.Failure(componentListResult.Error);
        }

        if (componentListResult.Data is null)
        {
            return Result<IEnumerable<ComponentByCategoryResponse>>.Failure(Error.NoData);
        }

        var result = componentListResult.Data.Select(component => new ComponentByCategoryResponse(
            component.ComponentId,
            component.ComponentCode,
            component.ComponentName,
            component.ComponentTypeId,
            component.StatusId,
            component.Status
        ));

        return Result<IEnumerable<ComponentByCategoryResponse>>.Success(result);
    }
}

