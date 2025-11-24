using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MiniValidation;
using ONEHub.Application.Features.PageBuilder.Commands;
using ONEHub.Application.Features.PageBuilder.Queries;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Results;
using ONEHub.WebApi.Features.GenerateLink;
using ONEHub.WebApi.Features.LandingPages;

namespace ONEHub.WebApi.Features.PageBuilder;

public static class PageBuilderEndpoint
{
    public static IEndpointRouteBuilder RegisterPageBuilderEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/pagebuilder").RequireAuthorization();
        //var groupEndpoint = endpoints.MapGroup("/api/pagebuilder");

        groupEndpoint.MapPost("/create", Create);
        groupEndpoint.MapGet("/edit", Edit);
        groupEndpoint.MapGet("/detail", GetPageBuilderDetail);
        groupEndpoint.MapGet("/getmedia", GetMedia);
        groupEndpoint.MapGet("/status", GetLandingPageStatus);

        return groupEndpoint;
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
            PageCode = request.PageCode,
            PageName = request.PageName,
            CampaignId = request.CampaignId,
            LanguageCode = request.LanguageCode,
            TargetCountryCode = request.TargetCountryCode,
            IsPreview = request.IsPreview,
            StatusId = request.StatusId
        };

        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result>, ValidationProblem>> Edit(
        [FromBody] CreateLandingPageRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new CreateLandingPageCommand
        {
            PageCode = request.PageCode,
            PageName = request.PageName,
            CampaignId = request.CampaignId,
            LanguageCode = request.LanguageCode,
            TargetCountryCode = request.TargetCountryCode,
            IsPreview = request.IsPreview,
            StatusId = request.StatusId
        };

        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<MediaItem>>, ValidationProblem>> GetMedia(
        [FromBody] GetMediaRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetMediaQuery
        {
            ModuleId = request.ModuleId,
            TargetCountryCode = request.TargetCountryCode,
            LanguageCode = request.LanguageCode
        };

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<IEnumerable<StatusInfo>>>, ValidationProblem>> GetLandingPageStatus(
        IMediator mediator)
    {
        var query = new GetLandingPageStatusQuery();
        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<PageBuilderDetail>>, ValidationProblem>> GetPageBuilderDetail(
        [FromBody] GetPageBuilderDetailRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetPageBuilderDetailQuery
        {
            PageId = request.PageId
        };
        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }
}

