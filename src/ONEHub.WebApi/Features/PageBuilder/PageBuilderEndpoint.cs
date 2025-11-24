using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MiniValidation;
using Newtonsoft.Json;
using ONEHub.Application.Features.PageBuilder.Commands;
using ONEHub.Application.Features.PageBuilder.Queries;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Entities.LandingPages;
using ONEHub.Domain.Results;
using ONEHub.WebApi.Features.GenerateLink;

namespace ONEHub.WebApi.Features.PageBuilder;

public static class PageBuilderEndpoint
{
    public static IEndpointRouteBuilder RegisterPageBuilderEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/pagebuilder").RequireAuthorization();
        groupEndpoint.MapPost("/create", Create);
        groupEndpoint.MapPut("/update", Update);
        groupEndpoint.MapGet("/detail", GetPageBuilderDetail);
        groupEndpoint.MapGet("/media", GetMedia);
        groupEndpoint.MapGet("/modules", GetModules);
        groupEndpoint.MapGet("/status", GetLandingPageStatus);

        return groupEndpoint;
    }

    private static async Task<Results<Ok<Result<LandingResponse>>, ValidationProblem>> Create(
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
            StatusId = request.StatusId,
            ComponentStructure = JsonConvert.SerializeObject(request.ModuleComponentSettings)
        };

        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<LandingResponse>>, ValidationProblem>> Update(
        [FromBody] CreateLandingPageRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new UpdateLandingPageCommand
        {
            PageId = request.PageId,
            PageCode = request.PageCode,
            PageName = request.PageName,
            CampaignId = request.CampaignId,
            LanguageCode = request.LanguageCode,
            TargetCountryCode = request.TargetCountryCode,
            IsPreview = request.IsPreview,
            StatusId = request.StatusId,
            ComponentStructure = JsonConvert.SerializeObject(request.ModuleComponentSettings)
        };

        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<IEnumerable<MediaItem>>>, ValidationProblem>> GetMedia(
        [AsParameters] GetMediaRequest request,
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
    private static async Task<Results<Ok<Result<IEnumerable<ModuleInfo>>>, ValidationProblem>> GetModules(
       IMediator mediator)
    {
        var query = new GetModulesQuery();
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
        [AsParameters] GetPageBuilderDetailRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetPageBuilderDetailQuery
        {
            PageId = request.PageId,
            PageCode = request.PageCode,
            IsPreview = request.IsPreview
        };
        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }
}

