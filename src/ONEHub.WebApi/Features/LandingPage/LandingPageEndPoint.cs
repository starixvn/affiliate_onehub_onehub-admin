using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using ONEHub.Application.Features.LinkGenerator.Queries;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.LandingPage;

public static class LandingPageEndPoint
{
    public static IEndpointRouteBuilder RegisterLandingPageEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/landing-page").RequireAuthorization();

        groupEndpoint.MapGet("/options", GetOptions);

        return groupEndpoint;
    }

    private static async Task<Ok<Result<Dictionary<string, List<LandingPageOption>>>>> GetOptions(
        IMediator mediator)
    {
        var query = new GetLandingPageOptionsQuery();

        var result = await mediator.Send(query);

        return TypedResults.Ok(result);
    }
}

