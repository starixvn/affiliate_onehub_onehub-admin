using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MiniValidation;
using ONEHub.Application.Features.Link.Commands;
using ONEHub.Application.Features.Link.Queries;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.Link;

public static class LinkEndPoint
{
    public static IEndpointRouteBuilder RegisterLinkEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/link").RequireAuthorization();

        groupEndpoint.MapGet("/summary", Summary);
        groupEndpoint.MapGet("/", GetList);
        groupEndpoint.MapGet("/export", ExportList);
        groupEndpoint.MapPut("/{id}/status", UpdateStatus);

        return groupEndpoint;
    }

    private static async Task<Results<Ok<Result<LinkDashboardResponse>>, ValidationProblem>> Summary(
        [AsParameters] GetLinkDashboardRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetLinkDashboardQuery
        {
            Search = request.Search,
            CountryCodes = request.CountryCodes,
            ChannelIds = request.ChannelIds,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<PagingData<LinkResponse>>>, ValidationProblem>> GetList(
        [AsParameters] GetLinkListRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetLinkListQuery
        {
            PageSize = request.PageSize,
            PageIndex = request.PageIndex,
            Search = request.Search,
            StatusIds = request.StatusIds,
            CountryCodes = request.CountryCodes,
            ChannelIds = request.ChannelIds,
            StartDate = request.StartDate,
            EndDate = request.EndDate
        };

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<PagingData<LinkResponse>>>, ValidationProblem>> ExportList(
        [AsParameters] GetLinkListRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetLinkListQuery
        {
            PageSize = int.MaxValue,
            PageIndex = 1,
            Search = request.Search,
            StatusIds = request.StatusIds,
            CountryCodes = request.CountryCodes,
            ChannelIds = request.ChannelIds,
            StartDate = request.StartDate,
            EndDate = request.EndDate,
            IsExportExcel = true
        };

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result>, ValidationProblem>> UpdateStatus(
        int id,
        [FromBody] UpdateLinkStatusRequest request,
        IMediator mediator)
    {
        if (id != request.LinkId)
        {
            return TypedResults.Ok(Result.Failure(LinkError.InvalidLinkId));
        }

        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new UpdateLinkStatusCommand
        {
            LinkId = request.LinkId,
            StatusId = request.StatusId
        };

        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }
}

