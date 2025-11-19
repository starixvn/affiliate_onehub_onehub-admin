using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MiniValidation;
using ONEHub.Application.Features.LinkGenerator.Commands;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.GenerateLink;

public static class GenerateLinkEndpoint
{
    public static IEndpointRouteBuilder RegisterGenerateLinkEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/generate-link").RequireAuthorization();

        groupEndpoint.MapPost("/insert", Insert);

        return groupEndpoint;
    }

    private static async Task<Results<Ok<Result<LinkGeneratedResult>>, ValidationProblem>> Insert(
        [FromBody] InsertLinkRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var command = new InsertLinkCommand
        {
            LinkName = request.LinkName,
            IdentifierCode = request.IdentifierCode,
            CampaignId = request.CampaignId,
            CampaignCode = request.CampaignCode,
            CountryCode = request.CountryCode,
            MarketId = request.MarketId,
            ShortedLanguageCode = request.ShortedLanguageCode,
            EventIds = request.EventIds,
            EventCodes = request.EventCodes,
            GroupId = request.GroupId,
            GroupCode = request.GroupCode,
            ChannelId = request.ChannelId,
            ChannelCode = request.ChannelCode,
            AgencyId = request.AgencyId,
            AgencyCode = request.AgencyCode,
            TypeId = request.TypeId,
            TypeCode = request.TypeCode,
            PageType = request.PageType,
            PageCode = request.PageCode,
            DomainName = request.DomainName,
            DomainNote = request.DomainNote,
            ShortDomain = request.ShortDomain,
            ShortPath = request.ShortPath,
            Note = request.Note
        };

        var result = await mediator.Send(command);

        return TypedResults.Ok(result);
    }
}

