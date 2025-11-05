using MediatR;
using ONEHub.Domain.Criterias.Components;
using ONEHub.Domain.DTOs.Components;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Components.Queries;

public record GetComponentsByTypeQuery(
    int ComponentTypeId,
    int? ComponentId = null
) : IRequest<Result<IEnumerable<ComponentInfo>>>;

public class GetComponentsByTypeQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetComponentsByTypeQuery, Result<IEnumerable<ComponentInfo>>>
{
    public async Task<Result<IEnumerable<ComponentInfo>>> Handle(
        GetComponentsByTypeQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new GetComponentListCriteria
        {
            ComponentTypeId = request.ComponentTypeId,
            ComponentId = request.ComponentId
        };

        var results = await repository.FetchAsync<ComponentInfo>(criteria);

        if (results == null)
        {
            return Result<IEnumerable<ComponentInfo>>.Failure(Error.NoData);
        }

        return Result<IEnumerable<ComponentInfo>>.Success(results);
    }
}

