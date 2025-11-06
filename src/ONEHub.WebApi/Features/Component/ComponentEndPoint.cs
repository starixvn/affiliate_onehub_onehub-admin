using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using MiniValidation;
using ONEHub.Application.Features.Component.Queries;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.Component;

public static class ComponentEndPoint
{
    public static IEndpointRouteBuilder RegisterComponentEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/component").RequireAuthorization();

        groupEndpoint.MapGet("/summary", Summary);
        groupEndpoint.MapGet("/", GetList);

        return groupEndpoint;
    }

    private static async Task<Results<Ok<Result<List<ComponentSummaryResponse>>>, ValidationProblem>> Summary(
        IMediator mediator)
    {
        var query = new GetComponentSummaryQuery();
        var result = await mediator.Send(query);
        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<PagingData<ComponentResponse>>>, ValidationProblem>> GetList(
        [AsParameters] GetComponentListRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetComponentListQuery
        {
            PageSize = request.PageSize,
            PageIndex = request.PageIndex,
            Search = request.Search,
            CategoryIds = request.Category,
            StatusIds = request.Status,
            DeviceIds = request.DeviceIds
        };

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }
}
