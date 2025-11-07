using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MiniValidation;
using ONEHub.Application.Features.Component.Commands;
using ONEHub.Application.Features.Component.Queries;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.Component;

public static class ComponentEndPoint
{
    public static IEndpointRouteBuilder RegisterComponentEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/component").RequireAuthorization();

        groupEndpoint.MapGet("/summary", Summary);
        groupEndpoint.MapGet("/", GetList);
        groupEndpoint.MapPost("/", Create);
        groupEndpoint.MapPut("/{id}", Update);

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

    private static async Task<Results<Ok<Result>, ValidationProblem>> Create(
        [FromBody] CreateComponentRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }
        var command = new CreateComponentCommand
        {
            CategoryId = request.CategoryId,
            ComponentCode = request.ComponentCode,
            ComponentName = request.ComponentName,
            StatusId = request.StatusId,
            DeviceId = request.DeviceId
        };

        var result = await mediator.Send(command);
        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result>, ValidationProblem>> Update(
        int id,
        [FromBody] UpdateComponentRequest request,
        IMediator mediator)
    {
        if (id != request.ComponentId)
        {
            return TypedResults.Ok(Result.Failure(ComponentError.InvalidComponentId));
        }
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new UpdateComponentCommand
        {
            ComponentId = request.ComponentId,
            CategoryId = request.CategoryId,
            ComponentName = request.ComponentName,
            StatusId = request.StatusId,
            DeviceId = request.DeviceId
        };

        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }
}
