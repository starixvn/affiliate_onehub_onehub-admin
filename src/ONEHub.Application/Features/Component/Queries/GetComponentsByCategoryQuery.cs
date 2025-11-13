using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Component.Queries;

public class GetComponentsByCategoryQuery : BaseQuery<IEnumerable<ONEHub.Domain.Entities.Component>>
{
    public int CategoryId { get; set; }

    public int? ComponentId { get; set; }
}

public class GetComponentsByCategoryQueryHandler(IComponentRepository repository)
    : IRequestHandler<GetComponentsByCategoryQuery, Result<IEnumerable<ONEHub.Domain.Entities.Component>>>
{
    public async Task<Result<IEnumerable<ONEHub.Domain.Entities.Component>>> Handle(
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
            return Result<IEnumerable<ONEHub.Domain.Entities.Component>>.Failure(componentListResult.Error);
        }

        if (componentListResult.Data is null)
        {
            return Result<IEnumerable<ONEHub.Domain.Entities.Component>>.Failure(Error.NoData);
        }

        return Result<IEnumerable<ONEHub.Domain.Entities.Component>>.Success(componentListResult.Data);
    }
}

