using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Components.Queries;

public class GetComponentsByTypeQuery : BaseQuery<IEnumerable<ComponentInfo>>
{
    public int ComponentTypeId { get; set; }
    public int? ComponentId { get; set; }
}

public class GetComponentsByTypeQueryHandler(IComponentRepository repository)
    : IRequestHandler<GetComponentsByTypeQuery, Result<IEnumerable<ComponentInfo>>>
{
    public async Task<Result<IEnumerable<ComponentInfo>>> Handle(
        GetComponentsByTypeQuery request,
        CancellationToken cancellationToken)
    {
        var param = new GetComponentParam
        {
            ComponentTypeId = request.ComponentTypeId,
            ComponentId = request.ComponentId
        };

        var componentListResult = await repository.GetComponentAsync(param);

        if (componentListResult.IsFailure)
        {
            return Result<IEnumerable<ComponentInfo>>.Failure(componentListResult.Error);
        }

        if (componentListResult.Data is null)
        {
            return Result<IEnumerable<ComponentInfo>>.Failure(Error.NoData);
        }

        return Result<IEnumerable<ComponentInfo>>.Success(componentListResult.Data);
    }
}

