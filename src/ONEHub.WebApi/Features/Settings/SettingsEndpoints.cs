using MediatR;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using MiniValidation;
using ONEHub.Application.Features.LinkGenerator.Queries;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Results;

namespace ONEHub.WebApi.Features.Settings;

public static class SettingsEndpoints
{
    public static IEndpointRouteBuilder RegisterSettingsEndpoints(this IEndpointRouteBuilder endpoints)
    {
        var groupEndpoint = endpoints.MapGroup("/api/settings").RequireAuthorization();

        groupEndpoint.MapGet("/language", GetLanguages);

        return groupEndpoint;
    }

    private static async Task<Results<Ok<Result<IEnumerable<TargetCountry>>>, ValidationProblem>> GetLanguages(
        [AsParameters] GetLanguagesRequest request,
        IMediator mediator)
    {
        if (!MiniValidator.TryValidate(request, out var errors))
        {
            return TypedResults.ValidationProblem(errors);
        }

        var query = new GetLanguagesByCountryQuery(request.CountryCode);
        var result = await mediator.Send(query);
        return TypedResults.Ok(result);
    }
}

