using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MiniValidation;
using ONEHub.Application.Features.Campaign.Commands;
using ONEHub.Application.Features.Campaign.Queries;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.Campaign;

public static class CampaignEndPoint
{
    public static IEndpointRouteBuilder RegisterCampaignEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/campaign").RequireAuthorization();

        groupEndpoint.MapGet("/summary", Summary);
        groupEndpoint.MapGet("/dropdown", GetDropdownList);
        groupEndpoint.MapGet("/", GetList);
        groupEndpoint.MapGet("/export", ExportList);
        groupEndpoint.MapPost("/", Create);
        groupEndpoint.MapPut("/{id}", Update);
        groupEndpoint.MapPut("/status/batch", UpdateBatchStatus);
        groupEndpoint.MapDelete("/batch", DeleteBatch);

        return groupEndpoint;
    }

    private static async Task<Results<Ok<Result<CampaignDashboardResponse>>, ValidationProblem>> Summary(
        IMediator mediator)
    {
        var query = new GetCampaignDashboardQuery();

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<IEnumerable<CampaignBase>>>, ValidationProblem>> GetDropdownList(
        IMediator mediator)
    {
        var query = new GetCampaignDropdownQuery();

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<PagingData<CampaignResponse>>>, ValidationProblem>> GetList(
        [AsParameters] GetCampaignListRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetCampaignListQuery
        {
            PageSize = request.PageSize,
            PageIndex = request.PageIndex,
            Search = request.Search,
            StatusIds = request.Status
        };

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<PagingData<CampaignResponse>>>, ValidationProblem>> ExportList(
        [AsParameters] GetCampaignListRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetCampaignListQuery
        {
            PageSize = int.MaxValue,
            PageIndex = 1,
            Search = request.Search,
            StatusIds = request.Status,
            IsExportExcel = true
        };

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<CampaignCreatedResponse>>, ValidationProblem>> Create(
        [FromBody] CreateCampaignRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }
        var command = new CreateCampaignCommand
        {
            CampaignName = request.CampaignName,
            Description = request.Description,
            StatusId = request.StatusId
        };
        var result = await mediator.Send(command);
        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result>, ValidationProblem>> Update(
        int id,
        [FromBody] UpdateCampaignRequest request,
        IMediator mediator)
    {
        if (id != request.CampaignId)
        {
            return TypedResults.Ok(Result.Failure(CampaignError.InvalidCampaignId));
        }
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new UpdateCampaignCommand
        {
            CampaignId = request.CampaignId,
            CampaignName = request.CampaignName,
            Description = request.Description,
            StatusId = request.StatusId
        };

        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result>, ValidationProblem>> UpdateBatchStatus(
        [FromBody] UpdateBatchCampaignStatusRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new UpdateBatchCampaignStatusCommand
        {
            CampaignIds = request.CampaignIds,
            StatusId = request.StatusId
        };
        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result>, ValidationProblem>> DeleteBatch(
        [FromBody] DeleteBatchCampaignRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new DeleteBatchCampaignCommand
        {
            CampaignIds = request.CampaignIds
        };
        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }
}
