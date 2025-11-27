using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MiniValidation;
using ONEHub.Application.Features.LandingPages.PageManagement.Commands;
using ONEHub.Application.Features.LandingPages.PageManagement.Queries;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.PageManagement;

public static class PageManagementEndPoint
{
    public static IEndpointRouteBuilder RegisterPageManagementEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/page-management").RequireAuthorization();

        groupEndpoint.MapGet("/filters", GetFilters);
        groupEndpoint.MapGet("/", GetList);
        groupEndpoint.MapGet("/export", ExportList);
        groupEndpoint.MapPut("/status/batch", UpdateBatchStatus);
        groupEndpoint.MapDelete("/batch", DeleteBatch);

        return groupEndpoint;
    }

    private static async Task<Ok<Result<PageManagementFiltersResponse>>> GetFilters(IMediator mediator)
    {
        var query = new GetPageManagementFiltersQuery();

        var result = await mediator.Send(query);
        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<PagingDataWithDashboard<LandingPageResponse, PageManagementDashboardResponse>>>, ValidationProblem>> GetList(
        [AsParameters] GetLandingPageListRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetLandingPageListQuery
        {
            PageSize = request.PageSize,
            PageIndex = request.PageIndex,
            Search = request.Search,
            StatusIds = request.StatusIds,
            TargetCountryCodes = request.CountryCodes,
            LanguageCodes = request.LanguageCodes,
            FromDate = request.FromDate,
            ToDate = request.ToDate
        };

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<PagingDataWithDashboard<LandingPageResponse, PageManagementDashboardResponse>>>, ValidationProblem>> ExportList(
        [AsParameters] GetLandingPageListRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetLandingPageListQuery
        {
            Search = request.Search,
            StatusIds = request.StatusIds,
            TargetCountryCodes = request.CountryCodes,
            LanguageCodes = request.LanguageCodes,
            FromDate = request.FromDate,
            ToDate = request.ToDate,
            IsExportExcel = true
        };

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result>, ValidationProblem>> UpdateBatchStatus(
        [FromBody] UpdateBatchLandingPageStatusRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new UpdateBatchLandingPageStatusCommand
        {
            PageIds = request.PageIds,
            StatusId = request.StatusId
        };
        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result>, ValidationProblem>> DeleteBatch(
        [FromBody] DeleteBatchLandingPageRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new DeleteBatchLandingPageCommand
        {
            PageIds = request.PageIds
        };
        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }
}
