using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using ONEHub.Application.DTOs.LinkGenerator;
using ONEHub.Application.Features.LinkGenerator.Queries;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.GenerateLink;

public static class GenerateLinkEndpoint
{
    public static IEndpointRouteBuilder RegisterGenerateLinkEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/generate-link").RequireAuthorization();

        groupEndpoint.MapGet("/form-options", GetFormOptions);

        return groupEndpoint;
    }

    private static async Task<Ok<Result<LinkGeneratorFormOptionsDto>>> GetFormOptions(
        IMediator mediator)
    {
        var query = new GetLinkGeneratorFormOptionsQuery();
        var result = await mediator.Send(query);
        return TypedResults.Ok(result);
    }
}

