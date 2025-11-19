using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MiniValidation;
using ONEHub.Application.Features.LandingPages.PageBuilder.Commands;
using ONEHub.Application.Features.LandingPages.PageBuilder.Queries;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.PageBuilder;

public static class PageBuilderEndpoint
{
    public static IEndpointRouteBuilder RegisterPageBuilderEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/page-builder").RequireAuthorization();

        groupEndpoint.MapGet("/filters", GetFilters);
        groupEndpoint.MapGet("/", GetDetail);
        groupEndpoint.MapPost("/", Create);
        groupEndpoint.MapPut("/{pageId}", Update);

        return groupEndpoint;
    }

    private static async Task<Ok<Result<PageBuilderFiltersResponse>>> GetFilters(IMediator mediator)
    {
        var query = new GetPageBuilderFiltersQuery();

        var result = await mediator.Send(query);
        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<LandingPageDetailResponse>>, ValidationProblem>> GetDetail(
        [AsParameters] GetLandingPageDetailRequest request,
        IMediator mediator)
    {
        if (request.PageId == 0)
        {
            return TypedResults.Ok(Result<LandingPageDetailResponse>.Success(null!));
        }

        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetLandingPageDetailQuery
        {
            PageId = request.PageId
        };

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result>, ValidationProblem>> Create(
        [FromBody] CreateLandingPageRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new CreateLandingPageCommand
        {
            PageName = request.LpName,
            PageCode = request.LpCode,
            CampaignId = request.CampaignId,
            ModuleComponentsSetting = request.ModuleComponentsSetting.Select(x => new ModuleComponentCommand
            {
                ModuleId = x.ModuleId,
                MediaId = x.MediaId,
                ExtraInfo = x.ExtraInfo,
                OrderId = x.OrderId
            }),
            TargetCountryCode = request.TargetCountryCode,
            LanguageCode = request.LanguageCode,
            StatusId = request.StatusId,
            IsPreview = request.IsPreview
        };

        var result = await mediator.Send(command);
        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result>, ValidationProblem>> Update(
        int pageId,
        [FromBody] UpdateLandingPageRequest request,
        IMediator mediator)
    {
        if (pageId != request.PageId)
        {
            return TypedResults.Ok(Result.Failure(CampaignError.InvalidCampaignId));
        }
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new UpdateLandingPageCommand
        {
            PageId = request.PageId,
            PageName = request.LpName,
            CampaignId = request.CampaignId,
            ModuleComponentsSetting = request.ModuleComponentsSetting.Select(x => new ModuleComponentCommand
            {
                ModuleId = x.ModuleId,
                MediaId = x.MediaId,
                ExtraInfo = x.ExtraInfo,
                OrderId = x.OrderId
            }),
            TargetCountryCode = request.TargetCountryCode,
            LanguageCode = request.LanguageCode,
            StatusId = request.StatusId,
        };

        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }
}
