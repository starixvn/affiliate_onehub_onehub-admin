using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using ONEHub.Application.Features.Settings.Queries;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.Settings;

public static class SettingsEndpoints
{
    public static IEndpointRouteBuilder RegisterSettingsEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/settings").RequireAuthorization();

        groupEndpoint.MapGet("/countries", GetCountries);
        groupEndpoint.MapGet("/languages", GetLanguages);

        return groupEndpoint;
    }

    private static async Task<Ok<Result<IEnumerable<TargetCountry>>>> GetCountries(IMediator mediator)
    {
        var query = new GetCountriesQuery();
        var result = await mediator.Send(query);
        return TypedResults.Ok(result);
    }

    private static async Task<Results<Ok<Result<IEnumerable<Market>>>, ValidationProblem>> GetLanguages(
        IMediator mediator)
    {
        var query = new GetLanguagesQuery();
        var result = await mediator.Send(query);
        return TypedResults.Ok(result);
    }
}

