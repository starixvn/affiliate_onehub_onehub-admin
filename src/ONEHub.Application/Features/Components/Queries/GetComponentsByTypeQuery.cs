using MediatR;
using ONEHub.Domain.Criterias.Components;
using ONEHub.Domain.DTOs.Components;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Application.Features.Components.Queries;

public record GetComponentsByTypeQuery(
    int ComponentTypeId,
    int? ComponentId = null
) : IRequest<IEnumerable<ComponentInfo>>;

public class GetComponentsByTypeQueryHandler(IDynamicRepository repository)
    : IRequestHandler<GetComponentsByTypeQuery, IEnumerable<ComponentInfo>>
{
    public async Task<IEnumerable<ComponentInfo>> Handle(
        GetComponentsByTypeQuery request,
        CancellationToken cancellationToken)
    {
        var criteria = new GetComponentListCriteria
        {
            ComponentTypeId = request.ComponentTypeId,
            ComponentId = request.ComponentId
        };

        var results = await repository.FetchAsync<ComponentInfo>(criteria);
        return results;
    }
}

