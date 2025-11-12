using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Component.Queries;

public class GetComponentSummaryQuery : BaseQuery<List<ComponentSummaryResponse>>;

public record ComponentSummaryResponse(
    int ComponentTypeId,
    string ComponentTypeName,
    int Total,
    int Active,
    int Inactive
);

public class GetComponentSummaryHandler(IComponentRepository componentRepository)
    : IRequestHandler<GetComponentSummaryQuery, Result<List<ComponentSummaryResponse>>>
{
    public async Task<Result<List<ComponentSummaryResponse>>> Handle(
        GetComponentSummaryQuery request,
        CancellationToken cancellationToken)
    {
        var componentSummaryResult = await componentRepository.GetComponentSummaryAsync();

        if (componentSummaryResult.IsFailure)
        {
            return Result<List<ComponentSummaryResponse>>.Failure(componentSummaryResult.Error);
        }

        if (componentSummaryResult.Data is null)
        {
            return Result<List<ComponentSummaryResponse>>.Failure(Error.NoData);
        }

        var data = componentSummaryResult.Data
            .Select(x => new ComponentSummaryResponse(
                x.ComponentTypeId,
                x.ComponentTypeName,
                x.Total,
                x.Active,
                x.Inactive
            ))
            .ToList();

        return Result<List<ComponentSummaryResponse>>.Success(data);
    }
}
